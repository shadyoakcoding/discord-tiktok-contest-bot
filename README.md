# discord-tiktok-contest-bot
The purpose of this bot is to track submitted tiktok videos in a specified discord channel. It will work off of three commands: /tiktokchannel, /tiktokhashtag, and /tiktokexport.

1. COMMANDS - The slash commands that the bot will have.
    i. /tiktokcontest - This is a command for server members to get information about the contest. This includes things such as rules, prizes, deadlines, and more. This is a command that can be used by anyone in the server.

    ii. /tiktokdashboard - This command is admin only and will be used to spawn an embed that has buttons to spawn modals for setting the submission channel, the hashtags, and all of the data with view counts and such. It will have data validation where needed so there isn't room for user error. The export will include discord id, discord tag, tiktok name, view count, like count, and upload date.

2. DATA STORAGE - Rather than using a database, the submitted videos will be stored in csvs. At the time of submitting a video, the only information submitted will be video link, discord tag, discord name, and submission time.

3. TIKTOK DATA - Unfortunately I was unable to find any way to extract TikTok views with a given video link. TikTok doesn't have any public APIs that provide this data and it isn't easy (if possible) to webscrape as when you are on the page for a tiktok it doesn't actually say how many views a video has. However, it is worth noting that discord embeds for tiktok links contain video views along with likes. It is also worth noting that comments, shares, bookmarks, and likes can all be scraped along with the username and video description (including hashtags).

4. EXPORTING DATA - The data will be exported by going through the csv of submitted videos and then replying to the command user with a csv that contains tiktok analytics.