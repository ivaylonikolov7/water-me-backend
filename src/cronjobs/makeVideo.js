const videoshow = require('videoshow');
const fsPromises = require('fs').promises;
const cron = require('node-cron');

async function makeVideo(){
	let images = await getImagesFolder();
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
	console.log('images');
    let result = await getImagesFolder();
	console.log(result)

	videoshow(images, videoOptions)
	.save('video.mp4').on('start', ()=>{
		console.log('start');
	}).on('error', (err, stdout, stderr)=>{
		console.error('Error:', err)
		console.error('ffmpeg stderr:', stderr)
		console.error('ffmpeg stderr:', stdout)
	}).on('end', ()=>{
		console.log('end');
	})
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
        //makeVideo();
    })
};