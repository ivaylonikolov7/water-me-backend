const puppeteer = require('puppeteer');
const cron = require('node-cron');
const config = require('../config/config');

function getCurrentDate(){
	let date = new Date().getDate();
	let month = new Date().getMonth();
	let year = new Date().getFullYear();
	let hour = new Date().getHours();
	let minutes = new Date().getMinutes(); 
	let seconds = new Date().getSeconds();
	return `${date}-${month}-${year}-${hour}-${minutes}-${seconds}`;
}

module.exports = async function(){
    // cron.schedule('* */4 * * *',async () => {
        const browser = await puppeteer.connect({ browserWSEndpoint: config.BROWSERLESS_ENDPOINT });
        const page = await browser.newPage();
        await page.goto('https://www.youtube.com/watch?v=P-dukbUBtpE');
        await page.waitForSelector('.buttons ytd-button-renderer:nth-child(2)');
        let yesButton = await page.$('.buttons ytd-button-renderer:nth-child(2)');
        await yesButton.click();
        await page.evaluate(()=>{
          document.querySelector('.ytp-button.ytp-settings-button').click();
          document.querySelector('.ytp-panel-menu .ytp-menuitem:nth-child(2)').click();
          document.querySelector('.ytp-quality-menu .ytp-panel-menu .ytp-menuitem:nth-child(2)').click();
          document.querySelector('.ytp-chrome-bottom').style.display='none';
        })
        await page.waitForTimeout(5000);
        let player = await page.$('video');
        await player.screenshot({ 
            path: `src/images/${getCurrentDate()}.png`
        });
        console.log('here');
        await browser.close();
    // });
}