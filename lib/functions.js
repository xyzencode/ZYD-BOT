/**
 *  Created By Muhammad Adriansyah
 *  CopyRight 2024 MIT License
 *  My Github : https://github.com/xyzencode
 *  My Instagram : https://instagram.com/xyzencode
 *  My Youtube : https://youtube.com/@xyzencode
 */
import axios from 'axios';
import { fileURLToPath } from 'url';
import { unwatchFile, watchFile } from 'fs';

export function escapeRegExp(string) {
  return string.replace(/[.*=+:\-?^${}()|[\]\\]|\s/g, '\\$&');
}

export function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
export function getMime(url) {
  return new Promise(async (resolve, reject) => {
    try {
      const res = await axios.head(url);
      resolve(res.headers['content-type']);
    } catch (e) {
      reject(e);
    }
  });
}

export function getSize(url) {
  return new Promise(async (resolve, reject) => {
    try {
      const res = await axios.head(url);
      resolve(res.headers['content-length']);
    } catch (e) {
      reject(e);
    }
  });
}

export function byteToSize(bytes) {
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  if (bytes == 0) return '0 Byte';
  const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
  return Math.round(bytes / Math.pow(1024, i), 2) + ' ' + sizes[i];
}

export function fetchbuffer(url) {
  return new Promise(async (resolve, reject) => {
    try {
      const res = await axios.get(url, {
        responseType: 'arraybuffer',
        headers: {
          accept:
            'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36',
        },
      });
      resolve(res.data);
    } catch (e) {
      reject(e);
    }
  });
}

export const Styles = (text, style = 1) => {
  var xStr = 'abcdefghijklmnopqrstuvwxyz1234567890'.split('');
  var yStr = {
    1: 'ᴀʙᴄᴅᴇꜰɢʜɪᴊᴋʟᴍɴᴏᴘqʀꜱᴛᴜᴠᴡxʏᴢ1234567890',
  };
  var replacer = [];
  xStr.map((v, i) =>
    replacer.push({
      original: v,
      convert: yStr[style].split('')[i],
    })
  );
  var str = text.toLowerCase().split('');
  var output = [];
  str.map((v) => {
    const find = replacer.find((x) => x.original == v);
    find ? output.push(find.convert) : output.push(v);
  });
  return output.join('');
};

let fileP = fileURLToPath(import.meta.url);
watchFile(fileP, () => {
  unwatchFile(fileP);
  console.log(`Successfully To Update File ${fileP}`);
});
