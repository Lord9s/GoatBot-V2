const { getStreamFromURL, uploadImgbb } = global.utils;

module.exports = {
  config: {
    name: "antichangeinfobox",
    version: "1.9",
    author: "Lord King",
    countDown: 5,
    role: 0,
    description: {
      vi: "🔒 Chống thành viên đổi thông tin box chat 🔒",
      en: "🔒 Anti change info box 🔒"
    },
    category: "box chat",
    guide: {
      vi: "👉 {pn} [avt/name/nickname/theme/emoji] [on/off]",
      en: "👉 {pn} [avt/name/nickname/theme/emoji] [on/off]"
    }
  },
  langs: {
    vi: {
      success: "✅ Đã %1 chức năng chống đổi %2",
      alreadyOn: "🔔 Hiện tại box chat của bạn đang bật chức năng cấm thành viên đổi %1",
      missingAvt: "🚫 Box chat chưa đặt avatar"
    },
    en: {
      success: "✅ Successfully %1 anti change %2",
      alreadyOn: "🔔 Your box chat is currently on anti change %1",
      missingAvt: "🚫 Box chat has not set avatar"
    }
  },
  onStart: async function ({ message, event, args, threadsData, getLang }) {
    const types = ["avt", "name", "nickname", "theme", "emoji"];
    if (!types.includes(args[0]) || !["on", "off"].includes(args[1])) return message.SyntaxError();

    const { threadID } = event;
    const data = await threadsData.get(threadID, "data.antiChangeInfoBox", {});
    const key = args[0];

    if (key == "avt" && args[1] == "on" && !(await threadsData.get(threadID, "imageSrc"))) return message.reply(getLang("missingAvt"));

    data[key] = args[1] == "on";
    if (key == "avt" && args[1] == "on") data.avatar = await uploadImgbb(await threadsData.get(threadID, "imageSrc")).image.url;

    await threadsData.set(threadID, data, "data.antiChangeInfoBox");
    message.reply(getLang("success", args[1], key));
  },
  onEvent: async function ({ message, event, threadsData, role, api, getLang }) {
    const { threadID, logMessageType, logMessageData, author } = event;
    const data = await threadsData.get(threadID, "data.antiChangeInfoBox", {});

    if (role < 1 && api.getCurrentUserID() !== author) {
      switch (logMessageType) {
        case "log:thread-image":
          if (data.avt) {
            api.changeGroupImage(await getStreamFromURL(data.avatar), threadID);
            message.reply(getLang("alreadyOn", "avatar"));
          }
          break;
        case "log:thread-name":
          if (data.name) {
            api.setTitle(data.name, threadID);
            message.reply(getLang("alreadyOn", "name"));
          }
          break;
        case "log:user-nickname":
          if (data.nickname) {
            api.changeNickname(logMessageData.nickname, threadID, logMessageData.participant_id);
            message.reply(getLang("alreadyOn", "nickname"));
          }
          break;
        case "log:thread-color":
          if (data.theme) {
            api.changeThreadColor(data.theme, threadID);
            message.reply(getLang("alreadyOn", "theme"));
          }
          break;
        case "log:thread-icon":
          if (data.emoji) {
            api.changeThreadEmoji(data.emoji, threadID);
            message.reply(getLang("alreadyOn", "emoji"));
          }
          break;
      }
    }
  }
};
