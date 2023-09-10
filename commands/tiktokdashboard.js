const { SlashCommandBuilder } = require('@discordjs/builders');
const { replyDashboardEmbed } = require(`../embedCreator.js`);

module.exports = {
    data: new SlashCommandBuilder()
        .setName('tiktokdashboard')
        .setDescription('View the TikTok bot administrator dashboard.'),
    async execute(interaction) {
        await replyDashboardEmbed(interaction);
        return;
    },
};