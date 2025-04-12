
const fs = require("fs-extra");
const { utils } = global;

module.exports = {
  config: {
    name: "prefix",
    version: "1.4",
    author: "Lord King",
    countDown: 5,
    role: 0,
    description: {
      vi: "Thay đổi dấu lệnh của bot trong box chat của bạn hoặc cả hệ thống bot (chỉ admin bot)",
      en: "Change prefix of bot in your box chat or system bot (only admin bot)"
    },
    category: "config"
  },
  langs: {
    vi: {
      reset: "Đã reset prefix của bạn về mặc định: %1",
      onlyAdmin: "🚫 Chỉ admin mới có thể thay đổi prefix hệ thống bot",
      confirmGlobal: "Vui lòng thả cảm xúc bất kỳ vào tin nhắn này để xác nhận thay đổi prefix của toàn bộ hệ thống bot",
      confirmThisThread: "Vui lòng thả cảm xúc bất kỳ vào tin nhắn này để xác nhận thay đổi prefix trong nhóm chat của bạn",
      successGlobal: "✅ Đã thay đổi prefix hệ thống bot thành: %1",
      successThisThread: "✅ Đã thay đổi prefix trong nhóm chat của bạn thành: %1",
      myPrefix: "🌐 Prefix của hệ thống: %1\n🛸 Prefix của nhóm bạn: %2"
    },
    en: {
      reset: "Your prefix has been reset to default: %1",
      onlyAdmin: "🚫 Only admin can change prefix of system bot",
      confirmGlobal: "Please react to this message to confirm change prefix of system bot",
      confirmThisThread: "Please react to this message to confirm change prefix in your box chat",
      successGlobal: "✅ Changed prefix of system bot to: %1",
      successThisThread: "✅ Changed prefix in your box chat to: %1",
      myPrefix: "🌐 System prefix: %1\n🛸 Your box chat prefix: %2"
    }
  },
  onStart: async function ({ message, role, args, commandName, event, threadsData, getLang }) {
    if (!args[0]) {
      const msg = `╔═══════════════╗\n║ 📝 Prefix Info 📝 ║\n╠═══════════════╣\n║ 🌐 System prefix: ${global.GoatBot.config.prefix} ║\n║ 🛸 Your box chat prefix: ${utils.getPrefix(event.threadID)} ║\n╠═══════════════╣\n║ 👉 ${global.GoatBot.config.prefix}${commandName} <new prefix> ║\n║ 👉 ${global.GoatBot.config.prefix}${commandName} <new prefix> -g (only admin) ║\n║ 👉 ${global.GoatBot.config.prefix}${commandName} reset ║\n╚═══════════════╝`;
      return message.reply(msg);
    }

    if (args[0] == 'reset') {
      await threadsData.set(event.threadID, null, "data.prefix");
      return message.reply(getLang("reset", global.GoatBot.config.prefix));
    }

    const newPrefix = args[0];
    const formSet = { commandName, author: event.senderID, newPrefix };

    if (args[1] === "-g") {
      if (role < 2) return message.reply(getLang("onlyAdmin"));
      else formSet.setGlobal = true;
    } else {
      formSet.setGlobal = false;
    }

    return message.reply(args[1] === "-g" ? getLang("confirmGlobal") : getLang("confirmThisThread"), (err, info) => {
      formSet.messageID = info.messageID;
      global.GoatBot.onReaction.set(info.messageID, formSet);
    });
  },
  onReaction: async function ({ message, threadsData, event, Reaction, getLang }) {
    const { author, newPrefix, setGlobal } = Reaction;
    if (event.userID !== author) return;

    if (setGlobal) {
      global.GoatBot.config.prefix = newPrefix;
      fs.writeFileSync(global.client.dirConfig, JSON.stringify(global.GoatBot.config, null, 2));
      return message.reply(getLang("successGlobal", newPrefix));
    } else {
      await threadsData.set(event.threadID, newPrefix, "data.prefix");
      return message.reply(getLang("successThisThread", newPrefix));
    }
  }
};