const { getPrefix } = global.utils;
const { commands, aliases } = global.GoatBot;

module.exports = {
  config: {
    name: "help",
    version: "1.0",
    author: "Lord King",
    role: 0,
    shortDescription: {
      en: "View command list and usage"
    },
    category: "info",
    guide: {
      en: "{pn}help [command name]"
    }
  },
  onStart: async function ({ message, args, event, threadsData, role }) {
    const prefix = getPrefix(event.threadID);
    const uptime = process.uptime();
    const uptimeString = formatUptime(uptime);

    if (!args[0]) {
      let msg = "🔥 ᑕOᗰᗰᗩᑎᗪ ᒪIᎦT 🔥\n\n";
      const categories = {};

      for (const [name, value] of commands) {
        if (value.config.role > role) continue;
        const category = value.config.category || "Uncategorized";
        categories[category] = categories[category] || { commands: [] };
        categories[category].commands.push(name);
      }

      Object.keys(categories).forEach((category) => {
        msg += `📁 ${category.toUpperCase()}\n`;
        msg += categories[category].commands.sort().join(" 🔹 ");
        msg += "\n\n";
      });

      msg += `👉 𝕋𝕪𝕡𝕖 ${prefix}𝕙𝕖𝕝𝕡 <𝕔𝕠𝕞𝕞𝕒𝕟𝕕 𝕟𝕒𝕞𝕖> 𝕗𝕠𝕣 𝕞𝕠𝕣𝕖 𝕚𝕟𝕗𝕠\n`;
      msg += `⏰ ᑌᑭTIᗰᗴ: ${uptimeString}`;
      await message.reply(msg);
    } else {
      const commandName = args[0].toLowerCase();
      const command = commands.get(commandName) || commands.get(aliases.get(commandName));

      if (!command) {
        await message.reply(`🚫 ᑕOᗰᗰᗩᑎᗪ "${commandName}" ᑎOT ᖴOᑌᑎᗪ.`);
      } else {
        const configCommand = command.config;
        const response = `
╔═══════════════╗
║ 📊 ᑕOᗰᗰᗩᑎᗪ IᑎᖴO 📊 ║
╠═══════════════╣
║ 📝 ᑎᗩᗰᗴ: ${configCommand.name}
║ 📄 ᗪᗴᔕᑕᖇIᑭTIᑌᑎ: ${configCommand.longDescription?.en || "ᑎO ᗪᗴᔕᑕᖇIᑭTIᑌᑎ"}
║ 👥 ᖇOᒪᗴ: ${roleTextToString(configCommand.role)}
║ 📚 ᑌᔕᗩGᗴ: ${configCommand.guide?.en.replace(/{p}/g, prefix).replace(/{n}/g, configCommand.name) || "ᑎO GᑌIᗪᗴ ᗩᐯᗩIᒪᗩᗷᒪᗴ."}
║ ⏰ ᑌᑭTIᗰᗴ: ${uptimeString}
╚═══════════════╝
`;
        await message.reply(response);
      }
    }
  }
};

function roleTextToString(roleText) {
  switch (roleText) {
    case 0:
      return "👥 ᗩᒪᒪ ᑌᔕᗴᖇᔕ";
    case 1:
      return "👑 GᖇOᑌᑭ ᗩᗪᗰIᑎIᔕTᖇᗩTOᖇᔕ";
    case 2:
      return "🤖 ᗩᗪᗰIᑎ ᗷOT";
    default:
      return "❓ ᑌᑎKᑎOᗯᑎ ᖇOᒪᗴ";
 }
}

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
