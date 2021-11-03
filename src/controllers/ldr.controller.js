const dotenv = require('../config/config');
const uri = dotenv.mongoose.url;

const { MongoClient } = require('mongodb');
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

const index = async (req,res)=>{
    await client.connect();
    let countries = client.db('plants').collection('countries');
    let sortedCountries = await countries.find().sort({timesClicked:1}).toArray();
    res.json(sortedCountries);
}
module.exports = {index}