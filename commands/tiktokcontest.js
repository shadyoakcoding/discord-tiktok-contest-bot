const { SlashCommandBuilder } = require('@discordjs/builders');
const { replyContestEmbed } = require(`../embedCreator.js`);

module.exports = {
    data: new SlashCommandBuilder()
        .setName('tiktokcontest')
        .setDescription('See information regarding the TikTok contest.'),
    async execute(interaction) {
        await replyContestEmbed(interaction);
        return;
    },
};