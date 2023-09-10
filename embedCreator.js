const { EmbedBuilder } = require('discord.js');

function createDefaultEmbed() { // A function to create a default Unchained embed.
    let defaultEmbed = new EmbedBuilder()
        .setColor('#5da371')
        .setTimestamp()
        .setFooter({ text: "TikTok Helper by Shady", iconURL: "https://cdn.discordapp.com/attachments/991554703789920266/1150242910739124364/c1ea303c89bfb14896cdabcda931f556c5_100x100.png" });
    return defaultEmbed;
}

module.exports = { createDefaultEmbed };