import 'dotenv/config';
import { unwatchFile, watchFile } from 'fs';
import { fileURLToPath } from 'url';

global.owner = ['6289513081052'];
global.selfmode = true;
global.wm = 'Powered By Zayden';
global.nameBot = 'ZYD-BOT';
global.apikey = process.env.APIKEY || '';
global.thumbnailUrl = 'https://telegra.ph/file/ecea75426746c3debcde2.jpg';

global.pairing_code = {
  status: true,
  number: '',
};

let fileP = fileURLToPath(import.meta.url);
watchFile(fileP, () => {
  unwatchFile(fileP);
  console.info(`${fileP} file changed, restarting...`);
});
