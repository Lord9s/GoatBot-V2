
const { findUid } = global.utils;
const regExCheckURL = /^(http|https):\/\/[^ "]+$/;
const os = require('os');
const uptime = process.uptime();
const hours = Math.floor(uptime / 3600);
const minutes = Math.floor((uptime % 3600) / 60);
const seconds = Math.floor(uptime % 60);
const uptimeString = `${hours}h ${minutes}m ${seconds}s`;

module.exports = {
  config: {
    name: "uid",
    version: "1.3",
    author: "Lord King",
    countDown: 5,
    role: 0,
    description: {
      vi: "👀 Xem user id facebook của người dùng 👀",
      en: "👀 View facebook user id of user 👀"
    },
    category: "info"
  },
  langs: {
    vi: {
      syntaxError: "🚫 Vui lòng tag người muốn xem uid hoặc để trống để xem uid của bản thân"
    },
    en: {
      syntaxError: "🚫 Please tag the person you want to view uid or leave it blank to view your own uid"
    }
  },
  onStart: async function ({ message, event, args, getLang }) {
    if (event.messageReply) {
      const msg = `╔═══════════════╗\n║ 👤 User ID Info ║\n╠═══════════════╣\n║ 👤 User ID: ${event.messageReply.senderID} ║\n║ ⏰ Uptime: ${uptimeString} ║\n╚═══════════════╝`;
      return message.reply(msg);
    }

    if (!args[0]) {
      const msg = `╔═══════════════╗\n║ 👤 Your User ID Info ║\n╠═══════════════╣\n║ 👤 Your User ID: ${event.senderID} ║\n║ ⏰ Uptime: ${uptimeString} ║\n╚═══════════════╝`;
      return message.reply(msg);
    }

    if (args[0].match(regExCheckURL)) {
      let msg = `╔═══════════════╗\n║ 🔗 UID From Link Info ║\n╠═══════════════╣\n`;
      for (const link of args) {
        try {
          const uid = await findUid(link);
          msg += `║ 🔗 ${link} => ${uid} ║\n`;
        } catch (e) {
          msg += `║ 🔗 ${link} (ERROR) => ${e.message} ║\n`;
        }
      }
      msg += `╠═══════════════╣\n║ ⏰ Uptime: ${uptimeString} ║\n╚═══════════════╝`;
      message.reply(msg);
    } else {
      let msg = `╔═══════════════╗\n║ 👥 UID From Tag Info ║\n╠═══════════════╣\n`;
      const { mentions } = event;
      for (const id in mentions) {
        msg += `║ 👤 ${mentions[id].replace("@", "")}: ${id} ║\n`;
      }
      msg += `╠═══════════════╣\n║ ⏰ Uptime: ${uptimeString} ║\n╚═══════════════╝`;
      message.reply(msg || getLang("syntaxError"));
    }
  }
};