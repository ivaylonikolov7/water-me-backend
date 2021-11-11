var ffmpeg = require('fluent-ffmpeg');
var command = ffmpeg();
const fs = require('fs').promises;
const cron = require('node-cron');

async function downloadAllImages(){
    let bucket = {
        Bucket: 'water-plant-rpi',
        Delimiter: '/images'
    }
    for await (content of listAllKeys(bucket)){
        let files = content.Contents;
        for(file of files){
            if(file.Key != "images/"){
                let fileContent = await s3.getObject({
                    Bucket: 'water-plant-rpi',
                    Key: file.Key
                }).promise();
                console.log(fileContent.Body);
                await fs.writeFile(`src/${file.Key}`, fileContent.Body)
            }
        }   
    }

}

async function* listAllKeys(opts) {
    opts = { ...opts };
    do {
        const data = await s3.listObjectsV2(opts).promise();
        opts.ContinuationToken = data.NextContinuationToken;
        yield data;
    } while (opts.ContinuationToken);
}

async function makeVideo(uploadToS3){
	command.input('src/images/%*.png')
	.loop(5)
	.fps(25)
	.on('error', (err)=>{
		console.log(err)
	})
	.on('stderr', (err)=>{
		//console.log(err)
	})
	.on('end', ()=>{
		uploadToS3();
	})
	.save('video.mp4')
}
async function uploadToS3(){
	const video = await fs.readFile('video.mp4');
	console.log(video);
	await s3.upload({
		Bucket: 'water-plant-rpi',
		Key: `video/output.mp4`,
		Body: video
	}).promise(); 
}
module.exports = async function(){  
	await downloadAllImages();
	makeVideo(uploadToS3);
    cron.schedule('* 12 * * *',async () => {
    })
};