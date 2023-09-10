const { ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder } = require(`discord.js`);

async function showSetChannelModal(interaction) { // Function to show the set channel modal.
    let idInput = new TextInputBuilder() // Creating the Channel ID input for the modal.
        .setCustomId(`idInput`)
        .setLabel(`Submission Channel ID`)
        .setStyle(TextInputStyle.Short);

    let firstActionRow = new ActionRowBuilder()
        .addComponents(idInput);

    let channelIDModal = new ModalBuilder() // Creating the modal that contains the input fields.
        .setCustomId(`channelIDModal`)
        .setTitle(`What do you want to change the name to?`)
        .addComponents(firstActionRow);

    await interaction.showModal(channelIDModal); // Show the modal to the user who made this interaction.
}

async function showSetHashtagsModal(interaction) { // Function to show the set channel modal.
    let hashtagsInput = new TextInputBuilder() // Creating the Channel ID input for the modal.
        .setCustomId(`hashtagsInput`)
        .setLabel(`Hashtags (separated by commas)`)
        .setStyle(TextInputStyle.Short);

    let firstActionRow = new ActionRowBuilder()
        .addComponents(hashtagsInput);

    let hashtagsModal = new ModalBuilder() // Creating the modal that contains the input fields.
        .setCustomId(`hashtagsModal`)
        .setTitle(`Which hashtags must be in the TikTok?`)
        .addComponents(firstActionRow);

    await interaction.showModal(hashtagsModal); // Show the modal to the user who made this interaction.
}

async function showDeadlineModal(interaction) {
    let daysInput = new TextInputBuilder() // Creating the days input for the modal.
        .setCustomId(`daysInput`)
        .setLabel(`Video Age (in days)`)
        .setStyle(TextInputStyle.Short);

    let firstActionRow = new ActionRowBuilder()
        .addComponents(daysInput);

    let deadlineModal = new ModalBuilder() // Creating the modal that contains the input fields.
        .setCustomId(`deadlineModal`)
        .setTitle(`What is the maximum age for the TikTok?`)
        .addComponents(firstActionRow);

    await interaction.showModal(deadlineModal); // Show the modal to the user who made this interaction.
}

module.exports = { showSetChannelModal, showSetHashtagsModal, showDeadlineModal };