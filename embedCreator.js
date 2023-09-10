const { EmbedBuilder } = require('discord.js');

// Pulling required functions from other files
const { setChannelButton, setHashtagsButton, exportButton } = require(`./discordButtons.js`);
const { getChannelID, getHashtags } = require('./settings.js');

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
    \n\`i.\` Set the [channel ID](https://www.youtube.com/watch?v=NLWtSHWKbAI) of the TikTok submission channel (currently <#${getChannelID()}>).
    \n\`ii.\` Set the hashtags that the TikToks must have to count as a valid submission (currently \`${getHashtags()}\`).
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

async function replyChannelSavedEmbed(interaction, channelID) { // Sends an ambed saying the channel was saved.
    await interaction.deferReply({ ephemeral: true }); // Sends a deferred reply that is ephemeral.
    let channelSavedEmbed = createDefaultEmbed()
        .setDescription(`# The TikTok submission channel has been saved!\nSubmissions must now be in <#${channelID}>. If you can't click on that channel, you probably did something wrong.`);
    await interaction.editReply({
        embeds: [channelSavedEmbed],
        ephemeral: true
    });
}

async function replyNoHashtagsEmbed(interaction, inputString) { // Sends an embed if no hashtags were inputted.
    await interaction.deferReply({ ephemeral: true }); // Sends a deferred reply that is ephemeral.
    let noHashtagsEmbed = createDefaultEmbed()
        .setDescription(`# Invalid Hashtags\nWe couldn't find any hashtags in \`${inputString}\`. If you believe this is an error please contact <@488095760160915481>`);
    await interaction.editReply({
        embeds: [noHashtagsEmbed],
        ephemeral: true
    });
}

async function replyHashtagsEmbed(interaction, wordsWithHashtags) { // Replies an embed saying which hashtags were saved.
    await interaction.deferReply({ ephemeral: true }); // Sends a deferred reply that is ephemeral.
    let hashtagsEmbed = createDefaultEmbed()
        .setDescription(`# Hashtags Saved\nTikTok submissions now must contain these hashtags: \`${wordsWithHashtags}\``);
    await interaction.editReply({
        embeds: [hashtagsEmbed],
        ephemeral: true
    });
}

async function replyAdminOnlyEmbed(interaction) { // Replies an embed if the user interacting isn't administrator.
    let adminOnlyEmbed = createDefaultEmbed()
        .setDescription(`# This command is for administrators only!\nTry running \`/tiktokcontest\``);
    await interaction.editReply({
        embeds: [adminOnlyEmbed],
        ephemeral: true
    });
}

async function replyInvalidDaysEmbed(interaction) { // Replies an embed saying the inputted days is invalid.
    await interaction.deferReply({ ephemeral: true }); // Sends a deferred reply that is ephemeral.
    let invalidDaysEmbed = createDefaultEmbed()
        .setDescription(`# Invalid Age Input\n\`${interaction.fields.components[0].components[0].value}\` isn't a valid amount of days. Please enter an integer that is less than 1000.`);
    await interaction.editReply({
        embeds: [invalidDaysEmbed],
        ephemeral: true
    });
}

async function replyExportingDataEmbed(interaction, daysInput) { // Replies an embed saying that the user will receive a dm with the file shortly.
    await interaction.deferReply({ ephemeral: true }); // Sends a deferred reply that is ephemeral.
    let exportingDataEmbed = createDefaultEmbed()
        .setDescription(`# Exporting Data
        \nWithin a few minutes you should receive a DM with a file that contains information regarding submitted tiktoks within the last \`${daysInput}\` days.
        \nDo __**NOT**__ spam this command.`);
    await interaction.editReply({
        embeds: [exportingDataEmbed],
        ephemeral: true
    });
}

async function dmExportEmbed(interaction, exportFile, maxAge) { // Sends a DM to the user that has the export file.
    let exportCompleteEmbed = createDefaultEmbed()
        .setDescription(`# Export Complete
    \nHey <@${interaction.user.id}>! Please see above the attached data exported from submitted tiktoks that were uploaded at most \`${maxAge}\` days ago.
    \nI recommend looking at this data in [Google Sheets](https://www.youtube.com/watch?v=wH1y_oTUUX4)`);
    await interaction.user.send({
        embeds: [exportCompleteEmbed],
        files: [{
            attachment: exportFile,
            name: `export.csv`
        }]
    });
}

module.exports = { createDefaultEmbed, replyDashboardEmbed, replyAdminRequiredEmbed, replyContestEmbed, replyInvalidChannelEmbed, replyChannelSavedEmbed, replyNoHashtagsEmbed, replyHashtagsEmbed, replyAdminOnlyEmbed, replyInvalidDaysEmbed, replyExportingDataEmbed, dmExportEmbed };