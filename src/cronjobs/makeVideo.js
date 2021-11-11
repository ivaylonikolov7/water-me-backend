var ffmpeg = require('fluent-ffmpeg');
var command = ffmpeg();
var gm = require('gm');


const fsPromises = require('fs').promises;
const cron = require('node-cron');

async function makeVideo(){
	/*let images = await getImagesFolder();
	command.input('src/images/29-9-2021-0-48-9.png')
	.loop(5)
	.fps(25)
	.on('error', (err)=>{
		console.log(err)
	})
	.on('stderr', (err)=>{
		//console.log(err)
	})
	.on('end', ()=>{
		console.log('done');
	})
	.save('output.mp4')
	*/
}


async function getImagesFolder(){
	let images = await fsPromises.readdir('./src/images');
	return images.map(image=>{
		return 'src/images/' + image;
	})
}

module.exports = function(){
	makeVideo();
    cron.schedule('* 12 * * *',async () => {
			
    })
};