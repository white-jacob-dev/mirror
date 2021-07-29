const express = require('express');
const puppeteer = require('puppeteer');
const path = require('path');
const router = express.Router();

const app = express()
const port = 3000



async function scrapeProduct(url) {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(url);

    const [el] = await page.$x('//*[@id="main"]/div/div/div/section[1]/div[2]/div[2]/div[3]/a/div[1]/div[1]');
    const txt = await el.getProperty('textContent');
    const rawTxt = await txt.jsonValue();

    browser.close();

    console.log({rawTxt})

    return {rawTxt}
}


router.get('/',function(req,res){
    res.sendFile(path.join(__dirname+'/main.html'));
});


router.get('/data', async function(req, res) {
    let data = await scrapeProduct('https://www.fcbarcelona.com/en/football/first-team/schedule');
    res.send(data)
  })




  app.use('/', router);

  app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
  })

