const puppeteer = require(`puppeteer`);

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
    const browser = await puppeteer.launch(); // Launching the puppeteer browser.
    const page = await browser.newPage();

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
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
    } catch (error) {
        console.error(error);
        return null;
    }
}

getVideoDetails(`https://www.tiktok.com/@blitzskii.pt2/video/7274376192965233962`)
    .then(banana => {
        console.log(banana)
    });


module.exports = { tiktokUploadTime, getFullURL };