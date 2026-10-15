import { Client } from "meowsab";
import { subBots, subs } from "./system/sub.js";
import "moewsab/safe";
import * as baileys from "baileys"; 
import notif_ from "./system/notifications.js";

/* ======== Client Config  ====== */
const client = new Client({
/* ====== commands & session & baileys ======= */
  plugsdir: "commands",
  prefix: ["!", "."],
  library: [baileys],
  session_storage: { 
    type: "sqlite", // or json 
    path: "./auth" 
  },
/* ====== linking ======= */
  login: { 
    method: "pair", // or qr
    number: "201229982764",
    code: "ALHW1234" 
  },
/* ====== owners ======= */
  owners: [
    { jid: "201211883781@s.whatsapp.net", lid: "177223537545428@lid" },
    { username: "هواري" }
  ]
});
/* ======== System Plugins & Notifications ====== */
let config = client.config;
config.info = {
  channel: {
    jid: "",
    name: "هہ‏‏وآريـﮯ"
  },
}
/* ======== System Plugins & Notifications ====== */
const plugins = client.plug()
plugins.notification(notif_)

/* ======= Function (Start) ===== */
const start = async () => {
  await client.connect();
  await subBots(client);
  await subs.start();
}


start().catch((err) => {
  console.log(err.message)
});

