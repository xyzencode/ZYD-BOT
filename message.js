import './config.js';
import { unwatchFile, watchFile } from 'fs';
import { exec } from 'child_process';
import { fileURLToPath } from 'url';
import util from 'util';
import chalk from 'chalk';
import { getMime } from './lib/functions.js';

export default async function message(client, store, m, chatUpdate) {
  try {
    let isOwners = global.owner.includes(m.sender.split('@')[0]);
    let isCommand = (m.prefix && m.body.startsWith(m.prefix)) || false;
    let quoted = m.quoted ? m.quoted : m;

    if (!m.fromMe) {
      console.log(chalk.green.bold('Command:'), chalk.yellow.bold(m.body));
      console.log(chalk.green.bold('From:'), chalk.yellow.bold(m.sender));
      console.log(chalk.green.bold('Text:'), chalk.yellow.bold(m.text || ''));
    }

    switch (isCommand ? m.command.toLowerCase() : false) {
      case 'tiktok':
      case 'tiktokdl':
      case 'ttdl':
        {
          if (!m.text) return m.reply("Where's the link?");
          let res = await client.request('/api/downloader/tiktok', {
            url: m.text,
          });
          if (res.status !== true) return m.reply("Can't fetch the link");
          await client.sendVideo(m.from, res.url, 'Here is the video', m);
          await client.sendMessage(
            m.from,
            {
              audio: { url: res.audio },
              mimetype: 'audio/mp4',
              ptt: true,
            },
            { quoted: m }
          );
        }
        break;
      case 'igdl':
      case 'instagram':
      case 'ig':
        {
          if (!m.text) return m.reply("Where's the link?");
          let res = await client.request('/api/downloader/instagram', {
            url: m.text,
          });
          if (res.status !== true) return m.reply("Can't fetch the link");
          for (let i of res.data) {
            if (i.startsWith('https://scontent.cdninstagram.com')) {
              await client.sendImage(m.from, i, '', m);
            } else {
              await client.sendVideo(m.from, i, '', m);
            }
          }
        }
        break;
      default:
        if (
          ['>', 'eval'].some((a) => m.command.toLowerCase().startsWith(a)) &&
          isOwners
        ) {
          let evalCmd = '';
          try {
            evalCmd = /await/i.test(m.text)
              ? eval('(async() => { ' + m.text + ' })()')
              : eval(m.text);
          } catch (e) {
            evalCmd = e;
          }
          new Promise((resolve, reject) => {
            try {
              resolve(evalCmd);
            } catch (err) {
              reject(err);
            }
          })
            ?.then((res) => m.reply(util.format(res)))
            ?.catch((err) => m.reply(util.format(err)));
        }
        if (
          ['$', 'exec'].some((a) => m.command.toLowerCase().startsWith(a)) &&
          isOwners
        ) {
          try {
            exec(m.text, async (err, stdout) => {
              if (err) return m.reply(util.format(err));
              if (stdout) return m.reply(util.format(stdout));
            });
          } catch (e) {
            await m.reply(util.format(e));
          }
        }
    }
  } catch (e) {
    console.error(e);
  }
}

let fileP = fileURLToPath(import.meta.url);
watchFile(fileP, () => {
  unwatchFile(fileP);
  console.log(`Successfully To Update File ${fileP}`);
});
