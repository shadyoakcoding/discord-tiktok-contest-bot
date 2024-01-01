const puppeteer = require(`puppeteer`);
const csv = require('csv-parser');
const fs = require('fs');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const { getHashtags } = require(`./settings.js`);

const TIKTOK_DATA_PATH = `./tiktok_data.csv`;
const OUTPUT_CSV = 'export.csv';

function tiktokUploadTime(videoID) { // Function to get the time that a tikotk was uploaded based on the video ID. This is thanks to https://dfir.blog/tinkering-with-tiktok-timestamps/.
    let binaryString = parseInt(videoID).toString(2); // Turning the video ID to binary.
    const lengthDiff = 64 - binaryString.length; // Getting how much shorter the binary is than 64 chars.
    if (lengthDiff > 0) {
        binaryString = "0".repeat(lengthDiff) + binaryString; // Making sure that the binary string is 64 bits.
    }
    let left32 = binaryString.substring(0, 32); // Getting the first 32 characters from the binary string
    let decimal = parseInt(left32, 2);

    let date = new Date(decimal * 1000);
    const year = date.getFullYear();
    const month = date.getMonth() + 1; // Month is 0-based, so add 1
    const day = date.getDate();
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();

    // Format the date and time as a string (e.g., "2023-09-10 12:34:56")
    const formattedTime = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')} ${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    return formattedTime;
}

async function getVideoDetails(URL) { // A function that will take a given TikTok URL and provide details such as upload time, uploader, likes, bookmarks, comments, and shares.
    console.log(`Getting video details of ${URL}.`);
    let proxyInfo = getRandomProxy();
    let proxyArgs = [
        `--proxy-server=${proxyInfo.host}:${proxyInfo.port}`,
    ];

    const browser = await puppeteer.launch({
        headless: true, // Set to true for headless mode, false if you want to see the browser UI
        args: proxyArgs
    });
    const page = await browser.newPage();
    await page.authenticate({
        username: proxyInfo.username,
        password: proxyInfo.password,
    });
    const tiktokUrl = URL; // Replace with the actual TikTok URL
    await page.goto(tiktokUrl);

    const getHashtagsArray = async () => { // Function to get text content of StrongText elements within the specified selector
        const selector = '[data-e2e="browse-video-desc"]'; // The selector that holds all of the strongText (hashtags)
        await page.waitForSelector(selector);
        const element = await page.$(selector);
        const hashtagsArray = await element.$$eval('strong', (elements) => {
            return elements.map((el) => el.textContent);
        });
        return hashtagsArray;
    };
    const hashtagsArray = await getHashtagsArray();

    await page.waitForSelector('[data-e2e="like-count"]'); // Wait for the element containing like count to be visible
    const likeCountElement = await page.$('[data-e2e="like-count"]'); // The like count element.
    const likeCount = await page.evaluate((element) => {
        return element.textContent;
    }, likeCountElement);

    await page.waitForSelector('[data-e2e="comment-count"]'); // Wait for the element containing comment count to be visible
    const commentCountElement = await page.$('[data-e2e="comment-count"]'); // The comment count element
    const commentCount = await page.evaluate((element) => {
        return element.textContent;
    }, commentCountElement);

    await page.waitForSelector('[data-e2e="undefined-count"]'); // Wait for the element containing bookmark count to be visible
    const bookmarkCountElement = await page.$('[data-e2e="undefined-count"]'); // The bookmark count element
    const bookmarkCount = await page.evaluate((element) => {
        return element.textContent;
    }, bookmarkCountElement);

    await page.waitForSelector('[data-e2e="share-count"]'); // Wait for the element containing share count to be visible
    const shareCountElement = await page.$('[data-e2e="share-count"]'); // The share count element.
    const shareCount = await page.evaluate((element) => {
        return element.textContent;
    }, shareCountElement);

    await browser.close(); // Close the browser when done

    return { // Returning the scraped data.
        likeCount: likeCount,
        commentCount: commentCount,
        bookmarkCount: bookmarkCount,
        shareCount: shareCount,
        hashtags: hashtagsArray
    }
}

async function getFullURL(shortenedURL) { // Getting the full URL of a shortened tiktok url
    try {
        if (!shortenedURL.indexOf(`https://vm.tiktok.com`)) { // If the inputted URL isn't shortened, remove extra info and return it.
            let questionMarkIndex = shortenedURL.indexOf(`?`); // Getting the first index of a question mark in the shortened URL.
            if (questionMarkIndex !== -1) {
                return fullURL.substring(0, questionMarkIndex); // If the URL has question marks, remove the question mark and characters after it and then return the string.
            }
        }
        const response = await fetch(shortenedURL, {
            method: 'HEAD', // Use HEAD request to fetch headers only
            redirect: 'follow', // Follow redirects
        });

        if (response.ok) { // Getting the URL of the response.
            let fullURL = response.url; // The redirected URL.
            let questionMarkIndex = fullURL.indexOf(`?`); // Getting the first index of a question mark in the full URL.
            if (questionMarkIndex !== -1) {
                fullURL = fullURL.substring(0, questionMarkIndex); // If the full URL has question marks, remove the question mark and characters after it.
            }
            if (fullURL.match(/@[a-zA-Z0-9_]+/)) { // Regex to ensure the new URL contains the @ 
                return fullURL;
            }
        } else {
            console.log(`HTTP error! Status: ${response.status} when shortening the link:\n${shortenedURL}`)
        }
    } catch (error) {
        console.error(error);
        return null;
    }
}

async function createExport(maxAge) { // Exports the data, only considering tiktoks uploaded less than maxAge days ago.
    const requiredHashtags = getHashtags().map(tag => tag.toLowerCase()); // The required hashtags array but in lowercase
    const newFile = []; // Creating what will be the new csv file.
    let TIKTOK_DATA_RAW = fs.readFileSync(TIKTOK_DATA_PATH, 'utf-8'); // Read the contents of the tiktok data file.
    const TIKTOK_DATA = TIKTOK_DATA_RAW.trim().split('\n').map(row => row.split(','));
    for (let i = 1; i < TIKTOK_DATA.length; i++) { // Iterating through the array of rows, discluding the header row
        const ageInDays = Math.floor((new Date() - new Date(TIKTOK_DATA[i][3])) / (1000 * 60 * 60 * 24)); // Making sure tiktok age in days is low enough
        if (ageInDays <= maxAge) {
            let stats = await getVideoDetails(TIKTOK_DATA[i][2]); // Calling getVideoDetails on the tiktok URL for that row.
            if (!stats) break; // Going to the next TikTok if stats couldn't be pulled for this one.
            const newRow = {
                'Upload Date': TIKTOK_DATA[i][3],
                'Discord Handle': TIKTOK_DATA[i][0],
                'Discord ID': TIKTOK_DATA[i][1],
                'TikTok Link': TIKTOK_DATA[i][2],
                'Likes': stats.likeCount,
                'Comments': stats.commentCount,
                'Bookmarks': stats.bookmarkCount,
                'Shares': stats.shareCount,
            };
            const tikTokHashtags = stats.hashtags.map(tag => tag.toLowerCase().trim()); // The hashtags in the tiktok but in lowercase.
            for (const requiredTag of requiredHashtags) {
                if (tikTokHashtags.includes(requiredTag)) { // Requires one of the hashtags in the tiktok to be one of the required hashtags.
                    newFile.push(newRow); // At least one value from requiredHashtags (case-insensitive) is in stats.hashtags
                    break; // Exit the loop once a match is found
                }
            }
        }
    }
    const csvWriter = createCsvWriter({
        path: OUTPUT_CSV,
        header: ['Upload Date', 'Discord Handle', 'Discord ID', 'TikTok Link', 'Likes', 'Comments', 'Bookmarks', 'Shares'],
    });
    await csvWriter.writeRecords(newFile);
    console.log('CSV file processing completed.');
}

function parseProxy(proxyString) {
    const [host, port, username, password] = proxyString.split(':');
    return {
        host,
        port,
        username,
        password
    };
}

function getRandomProxy() {
    const fileContents = fs.readFileSync('./proxies.txt', 'utf-8');
    const proxiesArray = fileContents.split('\n').map(line => line.trim());
    const validProxies = proxiesArray.filter(proxy => proxy !== '');
    const randomIndex = Math.floor(Math.random() * validProxies.length);
    return parseProxy(validProxies[randomIndex]); // Return a parsed proxy object
}

module.exports = { tiktokUploadTime, getFullURL, createExport };