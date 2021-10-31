const fs = require('fs');
const index = async (req,res)=>{
    fs.readdir('./src/images', (err, files)=>{
        res.send(JSON.stringify(files));
    })
    
}
module.exports = {index}