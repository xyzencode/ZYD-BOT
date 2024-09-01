import { unwatchFile, watchFile } from "fs";
import { fileURLToPath } from "url";

global.owner = ["6289513081052"];
global.selfmode = true;
global.wm = "Powered By Zayden";
global.nameBot = "ZYD-BOT";
global.apikey = "KhansaV1";

global.pairing_code = {
  status: true,
  number: "",
};

global.mess = {
  proses: "Sedang di proses...",
  gagal: "Gagal, silahkan coba beberapa saat lagi!",
  error: "Terjadi kesalahan, silahkan coba beberapa saat lagi!",
  ownerOnly: "Perintah ini hanya untuk Owner bot!",
};

let fileP = fileURLToPath(import.meta.url);
watchFile(fileP, () => {
  unwatchFile(fileP);
  console.info(`${fileP} file changed, restarting...`);
});
