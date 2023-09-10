// Importing Required Dependencies
require('dotenv').config();
const { Client, GatewayIntentBits, Partials, Collection } = require('discord.js');
const fs = require('node:fs');
const path = require('node:path');

// Required imports from other files

const client = new Client({ intents: [GatewayIntentBits.Guilds], partials: [Partials.Channel] }); // Create a new client instance

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
    startTransactionListener();
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
            case `homeButton`:
                
                break;
        }
    }
});

client.login(process.env.DISCORD_TOKEN); // Logging into the discord bot.