const { chromium } = require("patchright");
const fs = require("fs");
const path = require("path");

const NUMBER_OF_PAGES = 6;

(async () => {
  const browser = await chromium.launchPersistentContext("data", {
    channel: "chrome",
    headless: false,
    viewport: null,
  });

  const page = await browser.newPage();
  const url = "https://cuesta.academicworks.com";
  const outputFile = path.join(__dirname, "scholarships.csv");

  fs.writeFileSync(outputFile, "Name,Description,Award,Deadline\n");

  await page.goto(url);
  const URLstoScrape = [] as any[];

  async function scrapeScholarshipPage(urlTail: any) {
    const fullUrl = `${url}${urlTail}`;
    await page.goto(fullUrl);
    await Promise.all([
      page.waitForSelector("#main > section > header > h3"),
      page.waitForSelector("#main > section > header > p:nth-child(3)"),
      page.waitForSelector(
        "#main > section > div.full-width-rows > dl:nth-child(1) > dd"
      ),
      page.waitForSelector(
        "#main > section > div.full-width-rows > dl:nth-child(2) > dd"
      ),
    ]);

    const name = await page.textContent("#main > section > header > h3");
    const description = await page.textContent(
      "#main > section > header > p:nth-child(3)"
    );
    const award = await page.textContent(
      "#main > section > div.full-width-rows > dl:nth-child(1) > dd"
    );
    const deadline = await page.textContent(
      "#main > section > div.full-width-rows > dl:nth-child(2) > dd"
    );

    fs.appendFileSync(
      outputFile,
      `"${name}","${description}","${award}","${deadline}"\n`
    );
  }

  async function scrapeTablePage() {
    const rows = await page.$$(
      "#main > section > section > table > tbody > tr"
    );

    for (const row of rows) {
      try {
        console.log("adding row");

        const link = await row.$("th > span > a");
        if (!link) continue;
        console.log(await link.getAttribute("href"));
        URLstoScrape.push(await link.getAttribute("href"));
      } catch (error: any) {
        console.error(`Error scraping row: ${error.message}`);
      }
    }
  }

  let hasNextPage = true;
  // Leaving so people know I was going to make this dynamic before I got lazy and didn't feel like checking for a disabled attribute on the button

  let i;
  for (i = 0; i < NUMBER_OF_PAGES - 1; i++) {
    console.log("Run #", i + 1);
    await scrapeTablePage();

    const nextPageButton = await page.$(
      "#main > section > section > div.pagination-table.clr.half-padded.shaded > div > a:nth-child(3)"
    );
    await nextPageButton.click();
    await page.waitForTimeout(2000);
    await page.waitForSelector(
      "#main > section > section > table > tbody > tr"
    );
  }

  for (const url of URLstoScrape) {
    console.log("Processing URL:", url);
    await scrapeScholarshipPage(url);
  }

  console.log("Scraping complete. Data saved to scholarships.csv.");
  await browser.close();
})();
