const { EmbedBuilder } = require('discord.js');

// Pulling required functions from other files
const { setChannelButton, setHashtagsButton, exportButton } = require(`./discordButtons.js`)

function createDefaultEmbed() { // A function to create a default Unchained embed.
    let defaultEmbed = new EmbedBuilder()
        .setColor('#5da371')
        .setTimestamp()
        .setFooter({ text: "TikTok Helper by Shady", iconURL: "https://cdn.discordapp.com/attachments/991554703789920266/1150242910739124364/c1ea303c89bfb14896cdabcda931f556c5_100x100.png" });
    return defaultEmbed;
}

async function replyDashboardEmbed(interaction) { // Replies with the dashboard for the discord bot.
    let dashboardEmbed = createDefaultEmbed()
        .setDescription(`# TikTok Bot Administrator Menu
    \nClick one of three buttons to do one of the following actions:
    \n\`i.\` Set the [channel ID](https://www.youtube.com/watch?v=NLWtSHWKbAI) of the TikTok submission channel.
    \n\`ii.\` Set the hashtags that the TikToks must have to count as a valid submission.
    \n\`iii.\` Export the file that contains the information regarding submitted TikToks.`);
    await interaction.editReply({
        embeds: [dashboardEmbed], components: [
            {
                type: 1,
                components: [setChannelButton, setHashtagsButton, exportButton],
            },
        ]
        , ephemeral: true
    });
}

async function replyAdminRequiredEmbed(interaction) { // Replies an embed saying the command is admin only.
    let adminOnlyEmbed = createDefaultEmbed()
        .setDescription(`# This is an admin command!
    \nHowever, if you want to see information about the tiktok contest, try \`/tiktokcontest\`.`);
    await interaction.editReply({
        embeds: [adminOnlyEmbed],
        ephemeral: true
    });
}

async function replyContestEmbed(interaction) { // Replies an embed with contest information.
    let TEMPORARY_CHANNEL_ID = `755747171638181936`;
    let HASHTAGSTRING = "#pogchamp";
    let adminOnlyEmbed = createDefaultEmbed()
        .setDescription(`# TikTok Contest!
    \nSubmit your TikToks in <#${TEMPORARY_CHANNEL_ID}> and the submission with the most views every week will win [PRIZE].
    \n
    \nBe sure to use the hashtags ${HASHTAGSTRING} in order for your TikTok to be counted!`);
    await interaction.editReply({
        embeds: [adminOnlyEmbed],
        ephemeral: true
    });
}

async function replyInvalidChannelEmbed(interaction) { // Replies an embed with contest information.
    await interaction.deferReply({ ephemeral: true }); // Sends a deferred reply that is ephemeral.
    let invalidChannelEmbed = createDefaultEmbed()
        .setDescription(`# Invalid channel ID!\nIf you need help getting the correct channel ID, watch [this video](https://www.youtube.com/watch?v=NLWtSHWKbAI).`);
    await interaction.editReply({
        embeds: [invalidChannelEmbed],
        ephemeral: true
    });
}

async function replyChannelSavedEmbed(interaction, channelID) {
    await interaction.deferReply({ ephemeral: true }); // Sends a deferred reply that is ephemeral.
    let channelSavedEmbed = createDefaultEmbed()
        .setDescription(`# The TikTok submission channel has been saved!\nSubmissions must now be in <#${channelID}>. If you can't click on that channel, you probably did something wrong.`);
    await interaction.editReply({
        embeds: [channelSavedEmbed],
        ephemeral: true
    })
}

module.exports = { createDefaultEmbed, replyDashboardEmbed, replyAdminRequiredEmbed, replyContestEmbed, replyInvalidChannelEmbed, replyChannelSavedEmbed };