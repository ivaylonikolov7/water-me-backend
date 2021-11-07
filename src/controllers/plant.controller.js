const axios = require('axios');

const index = async (req,res)=>{
    axios.get('http://79.134.54.240:3000/water-me').then(()=>{
        res.send('done');
    })
}
module.exports = {index}