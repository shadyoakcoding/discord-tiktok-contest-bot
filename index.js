// Importing Required Dependencies
require('dotenv').config();
const { Client, GatewayIntentBits, Partials, Collection } = require('discord.js');
const fs = require('node:fs');
const path = require('node:path');

// Required imports from other files
const { replyInvalidChannelEmbed, replyChannelSavedEmbed, replyNoHashtagsEmbed, replyHashtagsEmbed } = require(`./embedCreator.js`);
const { showSetChannelModal, showSetHashtagsModal } = require(`./modalCreator.js`);
const { loadSettings, setChannelID, setHashtags, getChannelID } = require(`./settings.js`);

const client = new Client({ // Create a new client instance
    intents: [
        GatewayIntentBits.Guilds, // Required to have the bot get guild (server) information
        GatewayIntentBits.GuildMessages, // Required to have the bot detect incoming messages in a server.
        GatewayIntentBits.MessageContent, // Required for the bot to read the contents of detected messages.
    ],
    partials: [Partials.Channel]
});

// Essential for the command handler:
client.commands = new Collection();
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);
    client.commands.set(command.data.name, command);
}

// Runs only once when the bot starts
client.once('ready', () => {
    console.log('Connected to Discord!');
    loadSettings();
});

client.on('interactionCreate', async interaction => { // Discord interaction listener.
    if (interaction.isCommand()) { // True if the interaction was a slash command.
        const command = client.commands.get(interaction.commandName);
        await interaction.deferReply({ ephemeral: true }); // Sends a deferred reply that is ephemeral.
        try {
            await command.execute(interaction);
        } catch (error) {
            console.error(error);
            await interaction.editReply({ content: 'There was an error while executing this command!', ephemeral: true });
        }
    } else {
        console.log(interaction.customId); // Logging the interaction that was triggered.
        switch (interaction.customId) { // Detecting for the customIds of buttons or modals and executing their code.
            // Button Interactions
            case `setChannelButton`:
                await showSetChannelModal(interaction);
                break;
            case `setHashtagsButton`:
                await showSetHashtagsModal(interaction);
                break;
            case `exportButton`:
                console.log(`Exporting Data...`);
                break;

            // Modal Interactions
            case `channelIDModal`:
                let channelID = interaction.fields.components[0].components[0].value;
                if (/^\d{19}$/.test(channelID)) { // Regex to make sure that the number inputted was a channel ID.
                    setChannelID(channelID); // Saving the channel ID.
                    await replyChannelSavedEmbed(interaction, channelID); // Sending the embed to say the channel ID was changed.
                } else {
                    await replyInvalidChannelEmbed(interaction);
                }
                break;
            case `hashtagsModal`:
                const words = interaction.fields.components[0].components[0].value.match(/\w+/g); // Using regex to find inputted words
                if (!words) { // True if no words were inputted.
                    await replyNoHashtagsEmbed(interaction, interaction.fields.components[0].components[0].value);
                } else {
                    const wordsWithHashtags = words.map(word => `#${word}`);
                    setHashtags(wordsWithHashtags);
                    await replyHashtagsEmbed(interaction, wordsWithHashtags);
                }
                break;
        }
    }
});

client.on('messageCreate', (message) => { // Discord message listener
    if (!message.channel.id === getChannelID()) { // Stopping code execution if message isn't in the right channel.
        return;
    }
    let tiktokLinkRegex = /https:\/\/(www\.)?(vm\.)?tiktok\.com\/[^\s]+/g; // Regex to extract either vm.tiktok.com links or tiktok.com links.
    let tikTokLinks = message.content.match(tiktokLinkRegex); // Using the regex to see if the message had links.
    let tikTokData = [];
    if (tikTokLinks) { // True if TikTok links were submitted.
        tikTokLinks.forEach(function (tikTokLink) {
            const submissionInfo = {
                discordHandle: message.author.username,
                discordID: message.author.id,
                videoLink: tikTokLink,
                submissionTime: new Date(message.createdTimestamp).toLocaleDateString('en-US')
            };
            const csvData = `${submissionInfo.discordHandle},${submissionInfo.discordID},${submissionInfo.videoLink},${submissionInfo.submissionTime}\n`; // Append the data to the CSV file
            fs.appendFileSync('tiktok_data.csv', csvData);
        });
    }
});


client.login(process.env.DISCORD_TOKEN); // Logging into the discord bot.