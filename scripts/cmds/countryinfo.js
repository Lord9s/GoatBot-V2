const axios = require('axios');

module.exports = {
  config: {
    name: "countryinfo",
    aliases: ["incoun", "country"],
    version: "2.0",
    author: "Jayden Smith",
    category: "info"
  },

  onStart: async function ({ api, event, args }) {
    const query = args.join(' ');

    if (!query) {
      return api.sendMessage("Please provide a country name!", event.threadID, event.messageID);
    }

    try {
      const response = await axios.get(`https://restcountries.com/v3/name/${query}`);

      if (response.data && response.data.length > 0) {
        const country = response.data[0];
        let message = '';

        // Adding more details with emojis
        message += `🌍 𝗖𝗢𝗨𝗡𝗧𝗥𝗬 𝗜𝗡𝗙𝗢𝗠𝗔𝗧𝗜𝗢𝗡 🌍\n`;
        message += `🏳️ 𝑁𝐴𝑀𝐸: ${country.name.common}\n`;
        message += `🏛️ 𝐶𝐴𝑃𝐼𝑇𝐴𝐿: ${country.capital}\n`;
        message += `👨‍👩‍👧‍👦 𝑃𝑂𝑃𝑈𝐿𝐴𝑇𝐼𝑂𝑁: ${country.population}\n`;
        message += `🗣️ 𝐿𝐴𝑁𝐺𝑈𝐴𝐺𝐸𝑆(𝑆): ${Object.values(country.languages).join(', ')}\n`;
        message += `💰 𝐶𝑈𝑅𝑅𝐸𝑁𝐶𝑌: ${Object.values(country.currencies).map(curr => curr.name).join(', ')}\n`;
        message += `🌐 𝑅𝐸𝐺𝐼𝑂𝑁: ${country.region}\n`;
        message += `🌍 𝑆𝑈𝐵𝑅𝐸𝐺𝐼𝑂𝑁: ${country.subregion}\n`;
        message += `📍 𝐵𝑂𝑅𝐷𝐸𝑅𝑆: ${country.borders ? country.borders.join(', ') : 'None'}\n`;
        message += 🗺 𝐴𝑅𝐸𝐴: ${country.area} sq km\n`;

        // Adding multiple motivational quotes
        const quotes = [
          "🌟 Believe you can and you're halfway there.",
          "🚀 The only way to do great work is to love what you do.",
          "💪 What you get by achieving your goals is not as important as what you become by achieving your goals.",
          "🌈 The future belongs to those who believe in the beauty of their dreams.",
          "🔥 Don't watch the clock; do what it does. Keep going.",
          "💫 Success is not the key to happiness. Happiness is the key to success.",
          "🌻 You are never too old to set another goal or to dream a new dream.",
          "🌟 The power of imagination makes us infinite.",
          "🌊 The harder you work for something, the greater you'll feel when you achieve it.",
          "🎯 Don't stop when you're tired. Stop when you're done.",
          "🌱 Dream it. Wish it. Do it.",
          "☀️ Sometimes later becomes never. Do it now.",
          "🌷 Great things never come from comfort zones.",
          "🦅 Dream big and dare to fail.",
          "🌸 It's going to be hard, but hard does not mean impossible.",
          "🏆 Success doesn't just find you. You have to go out and get it.",
          "🌟 The way to get started is to quit talking and begin doing.",
          "🚀 The best time to plant a tree was 20 years ago. The second best time is now.",
          "💪 The only limit to our realization of tomorrow is our doubts of today.",
          "🌈 Your limitation—it's only your imagination."
        ];

        // Select a random quote
        const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];

        message += `\n🔥 𝐻𝐴𝑉𝐸 𝐴 𝐺𝑅𝐸𝐴𝑇 𝐷𝐴𝑌! 🔥\n\n`;
        message += randomQuote;

        await api.sendMessage(message, event.threadID, event.messageID);
      } else {
        api.sendMessage("No country found with that name. Please check your input and try again!", event.threadID, event.messageID);
      }
    } catch (error) {
      api.sendMessage("I encountered an error while fetching the country information. Please try again later!", event.threadID, event.messageID);
    }
  }
};