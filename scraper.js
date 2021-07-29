const puppeteer = require('puppeteer');

async function scrapeProduct(url) {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(url);

    const [el] = await page.$x('//*[@id="main"]/div/div/div/section[1]/div[2]/div[2]/div[6]/a/div[1]/div[1]');
    const txt = await el.getProperty('textContent');
    const rawTxt = await txt.jsonValue();

    console.log({rawTxt});

    browser.close();
}

scrapeProduct('https://www.fcbarcelona.com/en/football/first-team/schedule');