import './config.js';
import makeWASocket, {
  Browsers,
  delay,
  DisconnectReason,
  jidNormalizedUser,
  makeCacheableSignalKeyStore,
  makeInMemoryStore,
  PHONENUMBER_MCC,
  useMultiFileAuthState,
} from '@xyzendev/baileys';
import pino from 'pino';
import chalk from 'chalk';
import readline from 'readline';
import fs from 'fs';
import NodeCache from 'node-cache';
import treeKill from './lib/treekill.js';
import { Boom } from '@hapi/boom';
import smsg, { Modules } from './lib/serialize.js';
import { exec } from 'child_process';

const logger = pino({
  timestamp: () => `,"time":"${new Date().toJSON()}"`,
}).child({ class: 'zayden' });
logger.level = 'fatal';

const question = (text) => {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  return new Promise((resolve) => {
    rl.question(text, resolve);
  });
};

const store = makeInMemoryStore({ logger });

async function Starting() {
  try {
    const { state, saveCreds } = await useMultiFileAuthState('session');
    const msgRetryCounterCache = new NodeCache();

    const client = makeWASocket.default({
      version: [2, 3000, 1015901307],
      logger,
      printQRInTerminal: !pairing_code.status,
      auth: {
        creds: state.creds,
        keys: makeCacheableSignalKeyStore(state.keys, logger),
      },
      browser: Browsers.macOS('Safari'),
      markOnlineOnConnect: true,
      generateHighQualityLinkPreview: true,
      syncFullHistory: true,
      retryRequestDelayMs: 10,
      msgRetryCounterCache,
      transactionOpts: { maxCommitRetries: 10, delayBetweenTriesMs: 10 },
      defaultQueryTimeoutMs: undefined,
      maxMsgRetryCount: 15,
      appStateMacVerification: {
        patch: true,
        snapshot: true,
      },
      getMessage: async (key) => {
        const jid = jidNormalizedUser(key.remoteJid);
        const msg = await store.loadMessage(jid, key.id);
        return msg?.message || list || '';
      },
    });

    store.bind(client.ev);

    await Modules({ client, store });

    if (pairing_code.status && !client.authState.creds.registered) {
      let number;
      if (pairing_code.number === '') {
        number = await question(
          chalk.blue(
            "Enter your phone number starting with your country's WhatsApp code, e.g., 62xxx:\n"
          )
        );
      }
      let phoneNumber = number.replace(/[^0-9]/g, '');
      if (
        !Object.keys(PHONENUMBER_MCC).some((v) => phoneNumber.startsWith(v))
      ) {
        throw chalk.red(
          "Invalid country code. Start with your country's WhatsApp code, e.g., 62xxx."
        );
      }
      await delay(5000);
      let code = await client.requestPairingCode(phoneNumber);
      console.log(
        `Pairing Code: ${chalk.green(
          code?.match(/.{1,4}/g)?.join('-') || code
        )}`
      );
    }

    client.ev.on('connection.update', (update) => {
      const { lastDisconnect, connection } = update;

      if (connection) {
        console.info(`Connection Status: ${chalk.cyan(connection)}`);
      }

      if (connection === 'close') {
        let reason = new Boom(lastDisconnect?.error)?.output.statusCode;

        switch (reason) {
          case DisconnectReason.badSession:
            console.info(chalk.red('Bad Session File, Restart Required'));
            Starting();
            break;
          case DisconnectReason.connectionClosed:
            console.info(chalk.red('Connection Closed, Restart Required'));
            Starting();
            break;
          case DisconnectReason.connectionLost:
            console.info(
              chalk.red('Connection Lost from Server, Restarting...')
            );
            Starting();
            break;
          case DisconnectReason.connectionReplaced:
            console.info(chalk.red('Connection Replaced, Restart Required'));
            Starting();
            break;
          case DisconnectReason.restartRequired:
            console.info(chalk.red('Restart Required, Restarting...'));
            Starting();
            break;
          case DisconnectReason.loggedOut:
            console.error(chalk.red('Device Logged Out, please ReScan...'));
            client.end();
            fs.rmSync('./session', {
              recursive: true,
              force: true,
            });
            exec('process.exit(1)', (err) => {
              if (err) return treeKill(process.pid);
            });
            break;
          case DisconnectReason.multideviceMismatch:
            console.error(
              chalk.red('Multi-Device Version Required, update and rescan...')
            );
            client.end();
            fs.rmSync('./session', {
              recursive: true,
              force: true,
            });
            exec('process.exit(1)', (err) => {
              if (err) return treeKill(process.pid);
            });
            break;
          default:
            console.log(chalk.yellow('Unrecognized issue, restarting...'));
            Starting();
        }
      }

      if (connection === 'open') {
        console.info(
          chalk.green('Connected to ' + chalk.blue(client.user.name))
        );
      }
    });

    client.ev.on('creds.update', saveCreds);

    client.ev.on('contacts.update', (update) => {
      for (let contact of update) {
        let id = jidNormalizedUser(contact.id);
        if (store && store.contacts) {
          store.contacts[id] = {
            ...(store.contacts?.[id] || {}),
            ...(contact || {}),
          };
        }
      }
    });

    client.ev.on('contacts.upsert', (update) => {
      for (let contact of update) {
        let id = jidNormalizedUser(contact.id);
        if (store && store.contacts) {
          store.contacts[id] = {
            ...(contact || {}),
            isContact: true,
          };
        }
      }
    });

    client.ev.on('groups.update', (updates) => {
      for (const update of updates) {
        const id = update.id;
        if (store.groupMetadata[id]) {
          store.groupMetadata[id] = {
            ...(store.groupMetadata[id] || {}),
            ...(update || {}),
          };
        }
      }
    });

    client.ev.on(
      'group-participants.update',
      ({ id, participants, action }) => {
        const metadata = store.groupMetadata[id];
        if (metadata) {
          switch (action) {
            case 'add':
            case 'revoked_membership_requests':
              metadata.participants.push(
                ...participants.map((id) => ({
                  id: jidNormalizedUser(id),
                  admin: null,
                }))
              );
              break;
            case 'demote':
            case 'promote':
              for (const participant of metadata.participants) {
                let id = jidNormalizedUser(participant.id);
                if (participants.includes(id)) {
                  participant.admin = action === 'promote' ? 'admin' : null;
                }
              }
              break;
            case 'remove':
              metadata.participants = metadata.participants.filter(
                (p) => !participants.includes(jidNormalizedUser(p.id))
              );
              break;
          }
        }
      }
    );

    client.ev.on('messages.upsert', async ({ messages }) => {
      if (!messages[0].message) return;

      let m = await smsg(client, messages[0], store);

      if (store.groupMetadata && Object.keys(store.groupMetadata).length === 0)
        store.groupMetadata = await client.groupFetchAllParticipating();
      if (m.key && !m.key.fromMe && m.key.remoteJid === 'status@broadcast') {
        if (
          m.type === 'protocolMessage' &&
          m.message.protocolMessage.type === 0
        )
          return;
        await client.readMessages([m.key]);
      }

      await (
        await import(`./message.js?v=${new Date().getTime()}`)
      ).default(client, store, m, messages[0]);
    });
  } catch (e) {
    console.error(e);
  }
}

Starting();
