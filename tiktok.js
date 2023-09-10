function tiktokUploadTime(videoID) { // Function to get the time that a tikotk was uploaded based on the video ID. This is thanks to https://dfir.blog/tinkering-with-tiktok-timestamps/.
    let binaryString = videoID.toString(2); // Turning the video ID to binary.
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

}

async function getFullURL(shortenedURL) { // Getting the full URL of a shortened tiktok url
    try {
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

const shortenedURL = 'https://vm.tiktok.com/ZMjMyTRqN/';
getFullURL(shortenedURL)
    .then((fullURL) => {
        console.log(fullURL)
    })
    .catch((error) => {
        console.error(error);
    });

module.exports = { tiktokUploadTime };