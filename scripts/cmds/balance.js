
module.exports = {
  config: {
    name: "balance",
    aliases: ["bal"],
    version: "1.2",
    author: "Lord King",
    countDown: 5,
    role: 0,
    description: {
      en: "💸 View your money or the money of the tagged person",
      vi: "💸 Xem số tiền hiện có của bạn hoặc người được tag"
    },
    category: "economy",
    guide: {
      en: `{pn} [ @tag ]`,
      vi: `{pn} [ @tag ]`
    }
  },
  langs: {
    en: {
      money: "💸 You have %1$",
      moneyOf: "%1 has %2$"
    },
    vi: {
      money: "💸 Bạn đang có %1$",
      moneyOf: "%1 đang có %2$"
    }
  },
  onStart: async function ({ message, usersData, event, getLang }) {
    const uptime = process.uptime();
    const uptimeString = formatUptime(uptime);

    if (Object.keys(event.mentions).length > 0) {
      const uids = Object.keys(event.mentions);
      let msg = "";
      for (const uid of uids) {
        const userMoney = await usersData.get(uid, "money");
        msg += getLang("moneyOf", event.mentions[uid].replace("@", ""), userMoney) + '\n';
      }
      return message.reply(`
╔═══════════════╗
║ 📊 𝗕𝗮𝗹𝗮𝗻𝗰𝗲 𝗜𝗻𝗳𝗼 📊 ║
╠═══════════════╣
║ ${msg}
║ ⏰ 𝗨𝗽𝘁𝗶𝗺𝗲: ${uptimeString}
╚═══════════════╝
`);
    }
    const userData = await usersData.get(event.senderID);
    message.reply(`
╔═══════════════╗
║ 📊 𝗕𝗮𝗹𝗮𝗻𝗰𝗲 𝗜𝗻𝗳𝗼 📊 ║
╠═══════════════╣
║ ${getLang("money", userData.money)}
║ ⏰ 𝗨𝗽𝘁𝗶𝗺𝗲: ${uptimeString}
╚═══════════════╝
`);
  }
};

function formatUptime(uptime) {
  let seconds = Math.floor(uptime % 60);
  let minutes = Math.floor((uptime / 60) % 60);
  let hours = Math.floor((uptime / (60 * 60)) % 24);
  let days = Math.floor(uptime / (60 * 60 * 24));

  let uptimeString = "";
  if (days > 0) uptimeString += `${days}d `;
  if (hours > 0) uptimeString += `${hours}h `;
  if (minutes > 0) uptimeString += `${minutes}m `;
  uptimeString += `${seconds}s`;

  return uptimeString;
}