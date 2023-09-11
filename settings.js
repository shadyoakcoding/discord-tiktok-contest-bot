const fs = require('fs');

// Default settings
let settings = {
  hashtags: ['#BoomerNA', '#BoomerNAisBack'],
  channelID: '1145136919995498559',
  prize: ``,
};

function loadSettings() { // Load settings from the JSON file, if it exists
  try {
    const data = fs.readFileSync('settings.json');
    settings = JSON.parse(data);
  } catch (err) {
    console.error('Error loading settings:', err.message);
  }
}

function saveSettings() { // Save the current settings to the JSON file
  try {
    fs.writeFileSync('settings.json', JSON.stringify(settings, null, 2));
    console.log('Settings saved successfully.');
  } catch (err) {
    console.error('Error saving settings:', err.message);
  }
}

function getHashtags() { // Function to get the current hashtags array
  return settings.hashtags;
}

function setHashtags(newHashtags) { // Function to set a new array of hashtags
  settings.hashtags = newHashtags;
  saveSettings();
}

function getChannelID() { // Function to get the current channelID
  return settings.channelID;
}

function setChannelID(newChannelID) { // Function to set a new channelID
  settings.channelID = newChannelID;
  saveSettings();
}

function getPrize() { // Function to get the current prize
  return settings.prize;
}

function setPrize(newPrize) { // Function to set a new prize
  settings.prize = newPrize;
  saveSettings();
}

module.exports = { settings, loadSettings, setChannelID, getChannelID, setHashtags, getHashtags, getPrize, setPrize };