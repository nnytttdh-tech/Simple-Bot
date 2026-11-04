/* ======== HOARY BOT - RAILWAY STARTUP ======== */

console.log("================================");
console.log("       HOARY BOT STARTING");
console.log("================================");

const requiredMajor = 22;
const requiredMinor = 18;

const [major, minor, patch] = process.versions.node
.split(".")
.map(Number);

console.log("Node.js:", process.version);

if (
major < requiredMajor ||
(major === requiredMajor && minor < requiredMinor)
) {
console.error("ERROR: Node.js 22.18.0 or later is required.");
process.exit(1);
}

console.log("[OK] Node.js version accepted.");

async function start() {
try {
console.log("[1/5] Loading Meowsab...");

const { Client } = await import("meowsab");

console.log("[2/5] Loading safe module...");

await import("meowsab/safe");

console.log("[3/5] Loading system modules...");

const { subBots, subs } = await import("./system/sub.js");

const baileys = await import("baileys");

const { default: notif_ } = await import(
  "./system/notifications.js"
);

console.log("[4/5] Configuring client...");

const client = new Client({
  plugsdir: "commands",
  prefix: ["!", "."],

  library: [baileys],

  session_storage: {
    type: "sqlite",
    path: "./auth"
  },

  login: {
    method: "pair",
    number: "+201557156992",
    code: "ALHW1234"
  },

  owners: [
    {
      jid: "201211883781@s.whatsapp.net",
      lid: "177223537545428@lid"
    },
    {
      username: "هواري"
    }
  ]
});

client.config.info = {
  channel: {
    jid: "",
    name: "هہ‏‏وآريـﮯ"
  }
};

const plugins = client.plug();
plugins.notification(notif_);

console.log("[5/5] Connecting bot...");

await client.connect();

console.log("[OK] Client connected.");

await subBots(client);
console.log("[OK] SubBots loaded.");

await subs.start();
console.log("[OK] Subs started.");

console.log("HOARY BOT IS ONLINE!");

} catch (error) {
console.error("================================");
console.error("       STARTUP ERROR");
console.error("================================");

console.error(error);
console.error(error.stack);

process.exitCode = 1;

}
}

start();