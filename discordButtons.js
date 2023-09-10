const { ButtonBuilder } = require(`discord.js`);

const setChannelButton = new ButtonBuilder()
    .setCustomId(`setChannelButton`)
    .setLabel(`Set Submission Channel`)
    .setStyle(`3`);

const setHashtagsButton = new ButtonBuilder()
    .setCustomId(`setHashtagsButton`)
    .setLabel(`Set Hashtags`)
    .setStyle(`3`);

const exportButton = new ButtonBuilder()
    .setCustomId(`exportButton`)
    .setLabel(`Export Data`)
    .setStyle(`3`);

    module.exports = { setChannelButton, setHashtagsButton, exportButton };