require("dotenv").config();

// MongoDB
const MongoClient = require("mongodb").MongoClient;
const ObjectId = require("mongodb").ObjectId;
const url = process.env.DATABASE_URL;
const options = {maxpoolSize: 15, useNewUrlParser: true, useUnifiedTopology: true}
const client = new MongoClient(url, options);

// AWS
const AWS = require("aws-sdk");
AWS.config.update({
    accessKeyId: process.env.AWS_KEY_ID,
    secretAccessKey: process.env.AWS_KEY_SECRET
});

const s3 = new AWS.S3();

module.exports = {
    client,
    ObjectId,
    s3
};