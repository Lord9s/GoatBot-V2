const { findUid } = global.utils;
const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

module.exports = {
  config: {
    name: "adduser",
    version: "1.5",
    author: "NTKhang",
    countDown: 5,
    role: 1,
    description: {
      vi: "Thêm thành viên vào box chat của bạn",
      en: "Add user to box chat of you"
    },
    category: "box chat",
    guide: {
      en: " {pn} [link profile | uid]"
    }
  },
  langs: {
    vi: {
      success: "✅ Đã thêm %1 thành viên vào nhóm",
      failed: "❌ Không thể thêm %1 thành viên vào nhóm",
      error: "❌ Lỗi: %1"
    },
    en: {
      success: "✅ Successfully added %1 members to the group",
      failed: "❌ Failed to add %1 members to the group",
      error: "❌ Error: %1"
    }
  },
  onStart: async function ({ message, api, event, args, threadsData, getLang }) {
    let success = 0, failed = 0, errors = [];

    for (const item of args) {
      try {
        let uid = isNaN(item) ? await findUid(item) : item;
        await api.addUserToGroup(uid, event.threadID);
        success++;
      } catch (err) {
        failed++;
        errors.push(item + ": " + err.message);
      }
      await sleep(500);
    }

    let msg = "";
    if (success) msg += `${getLang("success", success)}\n`;
    if (failed) msg += `${getLang("failed", failed)}\n${errors.map(e => getLang("error", e)).join('\n')}`;

    message.reply(`
╔══════════════════╗
║ 📊 Add User Result 📊 ║
╠══════════════════╣
${msg}
╚══════════════════╝
`);
  }
};
