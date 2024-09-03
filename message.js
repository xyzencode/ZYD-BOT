import './config.js';
import { fileURLToPath } from 'url';
import crypto from 'crypto';
import util from 'util';
import chalk from 'chalk';
import menu from './lib/menu.js';
import { exec } from 'child_process';
import { readFileSync, unlink, unwatchFile, watchFile } from 'fs';
import {
  byteToSize,
  fetchbuffer,
  getMime,
  getSize,
  Styles,
} from './lib/functions.js';

export default async function message(client, store, m, chatUpdate) {
  try {
    let isOwners = ['6289513081052', ...owner].includes(m.sender.split('@')[0]);
    let quoted = m.quoted ? m.quoted : m;
    let Downloaded = async (fileName) =>
      await client.downloadMediaMessage(quoted, fileName);
    let isCommand = (m.prefix && m.body.startsWith(m.prefix)) || false;

    if (!m.fromMe) {
      console.log(chalk.green.bold('Command:'), chalk.yellow.bold(m.body));
      console.log(chalk.green.bold('From:'), chalk.yellow.bold(m.sender));
      console.log(
        chalk.green.bold('Text:'),
        chalk.yellow.bold(m.text || 'null')
      );
    }

    switch (isCommand ? m.command.toLowerCase() : false) {
      case 'menu':
      case 'allmenu':
      case 'help':
        {
          let txt = Styles(
            `Hallo ${m.pushName} Perkenalkan Saya ${global.nameBot}\n\n`
          );
          Object.entries(menu).map(([type, command]) => {
            txt += `${Styles(type + ' Menu')}\n\n`;
            txt += `${command.map((v) => `${'> ' + v}`).join('\n')}`;
            txt += '\n\n';
          });
          await client.sendMessage(m.from, {
            text: txt,
            contextInfo: {
              externalAdReply: {
                title: global.nameBot,
                body: global.wm,
                thumbnailUrl: global.thumbnailUrl,
                sourceUrl: null,
                mediaType: 1,
                renderLargerThumbnail: true,
              },
            },
          });
        }
        break;
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
      case 'tiktokslide':
      case 'ttslide':
        {
          if (!m.text) return m.reply("Where's the link?");
          let res = await client.request('/api/downloader/tiktokslide', {
            url: m.text,
          });
          if (res.status !== true) return m.reply("Can't fetch the link");
          for (let i of res.data) {
            await client.sendImage(m.from, i, '', m);
          }
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
      case 'drive':
      case 'gdrive':
      case 'googledrive':
        {
          if (!m.text) return m.reply("Where's the link?");
          if (!m.text.includes('drive.google.com'))
            return m.reply('Only support google drive link');
          let res = await client.request('/api/downloader/drive', {
            url: m.text,
          });

          if (res.status !== true) return m.reply("Can't fetch the link");
          const mime = await getMime(res.data.download);
          const size = await getSize(res.data.download);
          if (size > 100000000) return m.reply('File is too large');
          await client.sendMessage(
            m.from,
            {
              document: { url: res.data.download },
              fileName: res.data.name,
              mimetype: mime,
              caption: `Name: ${res.data.name}\nSize: ${await byteToSize(
                size
              )}`,
            },
            { quoted: m }
          );
        }
        break;
      case 'samehadaku':
        {
          if (!m.text) return m.reply("Where's the link?");
          if (!m.text.includes('samehadaku'))
            return m.reply('Only support samehadaku link');
          let res = await client.request('/api/downloader/samehadaku', {
            url: m.text,
          });
          if (res.status !== true) return m.reply("Can't fetch the link");
          const video = res.data.downloads.find(
            (v) => v.name === 'Premium 720p'
          );
          const size = await getSize(video.link);
          if (size > 100000000)
            return m.reply(
              `File is too large\n\nLink Download : ${video.link}`
            );
          await client.sendVideo(m.from, video.link, res.data.title, m);
        }
        break;
      case 'snackvideo':
      case 'snackdl':
        {
          if (!m.text) return m.reply("Where's the link?");
          let res = await client.request('/api/downloader/snackvideo', {
            url: m.text,
          });
          if (res.status !== true) return m.reply("Can't fetch the link");
          await client.sendVideo(m.from, res.data, '', m);
        }
        break;
      case 'spotify':
      case 'spotdl':
      case 'spotifydl':
        {
          if (!m.text) return m.reply("Where's the link?");
          if (!m.text.includes('spotify'))
            return m.reply('Only support spotify link');
          let res = await client.request('/api/downloader/spotify', {
            url: m.text,
          });
          if (res.status !== true) return m.reply("Can't fetch the link");
          await client.sendMessage(m.from, {
            audio: await fetchbuffer(res.data.download),
            mimetype: 'audio/mp4',
            ptt: true,
            contextInfo: {
              externalAdReply: {
                title: `${res.data.metadata.preview.title} By ${res.data.metadata.preview.artist}`,
                body: global.wm,
                thumbnailUrl: res.data.metadata.preview.image,
                sourceUrl: null,
                mediaType: 2,
                renderLargerThumbnail: false,
              },
            },
          });
        }
        break;
      case 'ytmp3':
      case 'youtubeaudio':
        {
          if (!m.text) return m.reply("Where's the link?");

          let res = await client.request('/api/downloader/youtube', {
            url: m.text,
          });
          if (res.status !== true) return m.reply("Can't fetch the link");
          const size = await getSize(res.data.audio.url);
          if (size > 15000000) return m.reply('File is too large');
          const file =
            './temp/' + (await crypto.randomBytes(16).toString('hex')) + '.mp3';
          const execPro = util.promisify(exec);
          await execPro(
            `ffmpeg -i "${res.data.audio.url}" -q:a 0 -map a "${file}"`
          );
          await client
            .sendMessage(m.from, {
              audio: readFileSync(`${file}`),
              mimetype: 'audio/mp4',
              contextInfo: {
                externalAdReply: {
                  title: res.data.title,
                  body: global.wm,
                  thumbnailUrl: res.data.thumbnail,
                  sourceUrl: null,
                  mediaType: 1,
                  renderLargerThumbnail: true,
                },
              },
            })
            .then(() => unlink(file))
            .catch(() => {});
        }
        break;
      case 'ytmp4':
      case 'youtubevideo':
        {
          if (!m.text) return m.reply("Where's the link?");
          let res = await client.request('/api/downloader/youtube', {
            url: m.text,
          });
          if (res.status !== true) return m.reply("Can't fetch the link");
          const size = await getSize(res.data.video.url);

          if (size > 50000000) return m.reply('File is too large');
          await client.sendVideo(m.from, res.data.video.url, res.data.title, m);
        }
        break;
      case 'cekkhodam':
      case 'cekhodam':
        {
          if (!m.text) return m.reply("Where's the name?");
          let res = await client.request('/api/tools/cekkhodam', {
            Name: m.text,
          });
          if (res.status !== true) return m.reply('Internal Server Error');
          let txt = `*Data Khodam*\n\n`;
          txt += `*Name:* ${res.data.nama}\n`;
          txt += `*Khodam:* ${res.data.khodam}\n`;
          txt += `*Share:* ${res.data.share}\n`;
          m.reply(txt);
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
