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
      resolve(res.headers['content-type'].split('/')[0]);
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
