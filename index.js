console.clear();

import treekill from "./lib/treekill.js";
import path from "path";
import fs from "fs";
import { spawn } from "child_process";

let status = null;

function start(file) {
    if (status) {
        treekill(start.pid, "SIGTERM", (err) => {
            if (err) {
                console.log(err);
            } else {
                console.log('Proscess killed');
                status = null;
                start(file);
            }
        })
    } else {
        console.info("Starting process");
        let args = [path.join(process.cwd(), file), ...process.argv.slice(2)]
        let p = spawn(process.argv[0], args, {
            stdio: ["inherit", "inherit", "inherit", "ipc"]
        }).on("message", (data) => {
            console.log("[RECEIVED]", data)
            switch (data) {
                case "reset":
                    start(file)
                    break
                case "uptime":
                    p.send(process.uptime())
                    break
            }
        })
            .on("exit", (code) => {
                console.error("Exited with code:", code)
                if (code === 0) return
                fs.watchFile(args[0], () => {
                    fs.unwatchFile(args[0])
                    start(file)
                })
            })

        status = p

    }
}

(async () => {
    start("main.js");
})()