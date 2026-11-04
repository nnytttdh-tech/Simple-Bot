
import fs from "fs";
import path from "path";
import { pathToFileURL } from "url";

const PLUGINS_DIR = path.resolve("./commands");

function getFiles() {
  return fs.readdirSync(PLUGINS_DIR)
    .filter(file => file.endsWith(".js") && file !== "plugin.js");
}

function findPlugin(name) {
  return getFiles().find(file =>
    path.basename(file, ".js").toLowerCase() ===
    name.toLowerCase()
  );
}

async function loadPlugin(file) {
  const fullPath = path.join(PLUGINS_DIR, file);

  // استيراد نسخة جديدة من الملف بعد حفظه
  const url = pathToFileURL(fullPath);
  url.searchParams.set("update", Date.now().toString());

  const imported = await import(url.href);
  return imported.default;
}

export default {
  command: ["بلوقن", "plugin", "plugins"],
  owner: true,

  async execute(m, { conn, cli }) {
    const text = (m.text || "").trim();
    const args = text.split(/\s+/);
    const action = (args[1] || "").toLowerCase();
    const name = args[2];

    const reply = (message) => m.reply(message);

    // عرض القائمة
    if (["قائمة", "list", "لست"].includes(action)) {
      const files = getFiles();

      return reply(
        files.length
          ? "📦 قائمة البلوقنز:\n\n" +
            files.map((f, i) => `${i + 1}. ${f}`).join("\n")
          : "لا توجد بلوقنز."
      );
    }

    // عرض بلوقن
    if (["عرض", "show", "get"].includes(action)) {
      if (!name) return reply("اكتب اسم البلوقن.");

      const file = findPlugin(name);
      if (!file) return reply("البلوقن غير موجود.");

      const code = fs.readFileSync(
        path.join(PLUGINS_DIR, file), "utf8"
      );

      return reply("```javascript\n" + code + "\n```");
    }

    // حذف بلوقن
    if (["حذف", "delete", "del", "remove"].includes(action)) {
      if (!name) return reply("اكتب اسم البلوقن.");

      const file = findPlugin(name);
      if (!file) return reply("البلوقن غير موجود.");

      fs.unlinkSync(path.join(PLUGINS_DIR, file));

      if (global.plugins) {
        delete global.plugins[file];
      }

      return reply(`تم حذف ${file}`);
    }

    // إضافة أو تعديل بلوقن بالرد على الكود
    if (["اضف", "اضافة", "اضافه", "add", "تعديل", "edit"].includes(action)) {
      if (!m.quoted) {
        return reply("رد على كود JavaScript واكتب:\n!بلوقن اضف اسم");
      }

      let code = m.quoted.text || "";

      if (m.quoted.mimetype) {
        const buffer = await m.quoted.download();
        code = buffer.toString("utf8");
      }

      if (!code.trim()) {
        return reply("لم أجد كود JavaScript في الرسالة المردود عليها.");
      }

      if (!name) {
        return reply("اكتب اسم البلوقن.");
      }

      const safeName = name.replace(/[^a-zA-Z0-9_-]/g, "");
      if (!safeName) return reply("اسم البلوقن غير صالح.");

      const file = `${safeName}.js`;
      const fullPath = path.join(PLUGINS_DIR, file);

      // فحص صياغة الكود قبل الحفظ
      try {
        await import("data:text/javascript;base64," +
          Buffer.from(code).toString("base64"));
      } catch (error) {
        return reply("❌ خطأ في صياغة JavaScript:\n" + error.message);
      }

      const existed = fs.existsSync(fullPath);

      fs.writeFileSync(fullPath, code, "utf8");

      // استيراد الملف الجديد
      try {
        const plugin = await loadPlugin(file);

        // تحديث سجل البلوقنز إن كان محركك يستخدمه
        if (global.plugins) {
          global.plugins[file] = plugin;
        }

        return reply(
          `✅ تم ${existed ? "تعديل" : "إضافة"} البلوقن: ${file}\n` +
          "تم حفظه واستيراده."
        );
      } catch (error) {
        return reply(
          "تم حفظ الملف، لكن تعذر استيراده:\n" + error.message
        );
      }
    }

    return reply(
      "📌 أوامر إدارة البلوقنز:\n\n" +
      "!بلوقن قائمة\n" +
      "!بلوقن اضف اسم (بالرد على الكود)\n" +
      "!بلوقن تعديل اسم (بالرد على الكود)\n" +
      "!بلوقن عرض اسم\n" +
      "!بلوقن حذف اسم"
    );
  }
};
