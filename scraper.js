const express = require("express");
const puppeteer = require("puppeteer");
const path = require("path");
const router = express.Router();

const app = express();
const port = 3000;

//Get date, opponent, and time of next game
async function scrapeGameData(url) {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(url);

  //Get the date of the next game
  const [nextGame] = await page.$x(
    '//*[@id="main"]/div/div/div/section[1]/div[2]/div[2]/div[3]/a/div[1]/div[1]'
  );
  const nextGameTxt = await nextGame.getProperty("textContent");
  const nextGameRawTxt = await nextGameTxt.jsonValue();

  //Get time of the next game
  const [nextGameTime] = await page.$x(
    '//*[@id="main"]/div/div/div/section[1]/div[2]/div[2]/div[3]/a/div[1]/div[2]'
  );
  const nextGameTimeTxt = await nextGameTime.getProperty("textContent");
  const nextGameTimeRawTxt = await nextGameTimeTxt.jsonValue();

  //Get the next opponent
  const [nextOpponent] = await page.$x(
    '//*[@id="main"]/div/div/div/section[1]/div[3]/div/div[2]/div[2]/a/div[1]/div[1]'
  );
  const nextOpponentTxt = await nextOpponent.getProperty("textContent");
  const nextOpponentRawTxt = await nextOpponentTxt.jsonValue();

  browser.close();
  return { nextGameRawTxt, nextGameTimeRawTxt, nextOpponentRawTxt, };
}

// -------------WORK IN PROGRESS------------------
// //Get the next opponent's logo
// async function scrapeLogo(url) {
//   const browser = await puppeteer.launch();
//   const page = await browser.newPage();
//   await page.goto(url);

//   const [nextOpponentLogo] = await page.$x(
//     '//*[@id="main"]/div/div/div/section[1]/div[3]/div/div[2]/div[2]/a/div[1]/div[2]/span[1]/i'
//   );
//   await nextOpponentLogo.screenshot({path:"./design/logo.png", omitBackground: true});

//   browser.close();
//   return;
// }

router.get("/", async function (req, res) {
  // await scrapeLogo("https://www.fcbarcelona.com/en/football/first-team/schedule")
  res.sendFile(path.join(__dirname + "/index.html"));
});

router.get("/gamedata", async function (req, res) {
  let data = await scrapeGameData(
    "https://www.fcbarcelona.com/en/football/first-team/schedule"
  );
  res.send(data);
});

//Express JS static folder that gets hosted
app.use("/design",express.static('design'));

app.use("/", router);

app.listen(port, () => {
  console.log(`App launched at: http://localhost:${port}`);
});
