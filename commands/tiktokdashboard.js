const { SlashCommandBuilder } = require('@discordjs/builders');
const { PermissionsBitField } = require(`discord.js`);
const { replyDashboardEmbed, replyAdminOnlyEmbed } = require(`../embedCreator.js`);

module.exports = {
    data: new SlashCommandBuilder()
        .setName('tiktokdashboard')
        .setDescription('View the TikTok bot administrator dashboard.'),
    async execute(interaction) {
        if (interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) { // Makes sure the user calling the command is an admin.
            await replyDashboardEmbed(interaction);
        } else {
            await replyAdminOnlyEmbed(interaction);
        }
        return;
    },
};