# Cuesta Scholarship Scraper

This is a very simple script that scrapes the Cuesta College website for scholarships. There isn't that much of a point to it as you can apply for all of them with the general application, but it's nice to have I guess. It utilizes the [Patchright](https://github.com/Kaliiiiiiiiii-Vinyzu/patchright-nodejs) library to scrape the website, but you may replace the import at the very top with standard playwright if you prefer.

It's a drop-in replacement, so no need to change anything else.

## Usage

1. Clone the repository `git clone https://github.com/thebrrt/cuesta_scholarship_scraper.git`
2. Run `npm install` (or `bun install` if you're cool)
3. Run `node index.js` (or `bun index.js`)
4. Sit back and wait for the scraper to finish

You will find the scraped data in the `scholarships.csv` file.

## Disclaimer

This is a personal project and I am not responsible for any misuse of the data. Use it responsibly.
