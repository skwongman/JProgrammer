require("dotenv").config();

// MongoDB
const MongoClient = require("mongodb").MongoClient;
const url = process.env.DATABASE_URL;
const options = {maxpoolSize: 15, useNewUrlParser: true, useUnifiedTopology: true}
const client = new MongoClient(url, options);

module.exports = {
    client
};