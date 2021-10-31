const express = require('express');
const helmet = require('helmet');
const xss = require('xss-clean');
const mongoSanitize = require('express-mongo-sanitize');
const compression = require('compression');
const cors = require('cors');
const passport = require('passport');
const httpStatus = require('http-status');
const config = require('./config/config');
const morgan = require('./config/morgan');
const { jwtStrategy } = require('./config/passport');
const { authLimiter } = require('./middlewares/rateLimiter');
const routes = require('./routes/v1');
const leaderBoardRoutes = require('./routes/leaderboard.route');
const progressionRoutes = require('./routes/progression.route');
const { errorConverter, errorHandler } = require('./middlewares/error');
const ApiError = require('./utils/ApiError');

const cron = require('node-cron');
const puppeteer = require('puppeteer');

const app = express();

if (config.env !== 'test') {
  app.use(morgan.successHandler);
  app.use(morgan.errorHandler);
}

const videoshow = require('videoshow');
const fsPromises = require('fs').promises;

let images = [];

async function makeVideo(){
	let images = await getImagesFolder();
	//let images = ['src/images/29-9-2021-0-8-39.png', 'src/images/29-9-2021-0-19-8.png']

	const videoOptions = {
		fps: 1,
		transition: false,
		videoBitrate: 1024,
		videoCodec: 'libx264',
		size: '640x?',
		audioBitrate: '128k',
		audioChannels: 2,
		format: 'mp4',
		pixelFormat: 'yuv420p'
	}
	videoshow(images, videoOptions)
	.save('video.mp4').on('start', ()=>{
		console.log('start');
	}).on('error', (err)=>{
		console.log(err);
	}).on('end', ()=>{
		console.log('end');
	})
}

//makeVideo();

// set security HTTP headers
app.use(helmet());

// parse json request body
app.use(express.json());

// parse urlencoded request body
app.use(express.urlencoded({ extended: true }));

// sanitize request data
app.use(xss());
app.use(mongoSanitize());

// gzip compression
app.use(compression());

// enable cors
app.use(cors());
app.options('*', cors());

// jwt authentication
app.use(passport.initialize());
passport.use('jwt', jwtStrategy);

// limit repeated failed requests to auth endpoints
if (config.env === 'production') {
  app.use('/v1/auth', authLimiter);
}

app.use('/leaderboard', leaderBoardRoutes);
app.use('/progression', progressionRoutes);
// v1 api routes
app.use('/v1', routes);

// send back a 404 error for any unknown api request
app.use((req, res, next) => {
  next(new ApiError(httpStatus.NOT_FOUND, 'Not found'));
});

// convert error to ApiError, if needed
app.use(errorConverter);

// handle error
app.use(errorHandler);

//make a screenshot every day at 14:30 ( 30 14 * * * ) 

/*
cron.schedule('* * * * *',async () => {
	const browser = await puppeteer.connect({ browserWSEndpoint: config.BROWSERLESS_ENDPOINT });
	const page = await browser.newPage();
	await page.goto('https://www.youtube.com/watch?v=DZF7EUYvtxc');
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
	await browser.close();
});
*/



function getCurrentDate(){
	let date = new Date().getDate();
	let month = new Date().getMonth();
	let year = new Date().getFullYear();
	let hour = new Date().getHours();
	let minutes = new Date().getMinutes(); 
	let seconds = new Date().getSeconds();
	return `${date}-${month}-${year}-${hour}-${minutes}-${seconds}`;
}

async function getImagesFolder(){
	let images = await fsPromises.readdir('./src/images');
	return images.map(image=>{
		return 'src/images/' + image;
	})
}



module.exports = app;
