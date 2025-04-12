const itunes = require("searchitunes");
const { getStreamFromURL } = global.utils;

module.exports = {
  config: {
    name: "appstore",
    version: "1.2",
    author: "Lord King",
    countDown: 5,
    role: 0,
    description: {
      vi: "🔍 Tìm app trên appstore 🔍",
      en: "🔍 Search app on appstore 🔍"
    },
    category: "software",
    guide: {
      vi: "👉 {pn}: <keyword>\n - Ví dụ:\n {pn} PUBG",
      en: "👉 {pn}: <keyword>\n - Example:\n {pn} PUBG"
    },
    envConfig: {
      limitResult: 3
    }
  },
  langs: {
    vi: {
      missingKeyword: "🚫 Bạn chưa nhập từ khóa",
      noResult: "😔 Không tìm thấy kết quả nào cho từ khóa %1"
    },
    en: {
      missingKeyword: "🚫 You haven't entered any keyword",
      noResult: "😔 No result found for keyword %1"
    }
  },
  onStart: async function ({ message, args, commandName, envCommands, getLang }) {
    if (!args[0]) return message.reply(getLang("missingKeyword"));

    let results = [];
    try {
      results = (await itunes({
        entity: "software",
        country: "VN",
        term: args.join(" "),
        limit: envCommands[commandName].limitResult
      })).results;
    } catch (err) {
      return message.reply(getLang("noResult", args.join(" ")));
    }

    if (results.length > 0) {
      let msg = "📱 App Store Results 📱\n";
      msg += "═══════════════════════\n";
      const pendingImages = [];

      for (const result of results) {
        msg += `📝 App Name: ${result.trackCensoredName}\n`;
        msg += `👥 Developer: ${result.artistName}\n`;
        msg += `💸 Price: ${result.formattedPrice}\n`;
        msg += `⭐️ Rating: ${"🌟".repeat(Math.round(result.averageUserRating))} (${result.averageUserRating.toFixed(1)}/5)\n`;
        msg += `🔗 Link: ${result.trackViewUrl}\n`;
        msg += "═══════════════════════\n";
        pendingImages.push(await getStreamFromURL(result.artworkUrl512 || result.artworkUrl100 || result.artworkUrl60));
      }

      message.reply({
        body: msg,
        attachment: await Promise.all(pendingImages)
      });
    } else {
      message.reply(getLang("noResult", args.join(" ")));
    }
  }
};