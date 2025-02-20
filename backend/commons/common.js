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

// Google login (OAuth 2.0)
const { OAuth2Client } = require('google-auth-library');

const { GOOGLE_CLIENT_ID, GOOGLE_SECRET_KEY, JWT_SECRET_KEY, HOST } = process.env;

const oauthClient = new OAuth2Client({
    clientId: GOOGLE_CLIENT_ID,
    clientSecret: GOOGLE_SECRET_KEY,
    redirectUri: `${HOST}/api/user/oauth/callback`,
});

const jwt = require('jsonwebtoken');

function authenticateJWT(req, res, next) {
    let token = req.header('Authorization');
    if (token) {
        jwt.verify(token, JWT_SECRET_KEY, (err, user) => {
            if (err) {
                console.log(err)
                return res.sendStatus(403);
            }
            req.user = user;
            next();
        });
    } else {
        res.sendStatus(401);
    }
}

// Generate time
function generateTime(){
    const date = new Date();
    const offset = 8;
    const utc = date.getTime() + (date.getTimezoneOffset() * 60000);
    const nd = new Date(utc + (3600000 * offset));
    const hkTime = new Date(nd.getTime() + (3600000 * offset));
    const hkTimeString = hkTime.toISOString().replace(/T/, " ").replace(/Z$/, "+08:00");
    const time = hkTimeString.split(" ")[0] + ", " + hkTimeString.split(" ")[1].slice(0, 5);
    return time;
};

function generateChatTime(){
    const date = new Date();
    const offset = 8;
    const utc = date.getTime() + (date.getTimezoneOffset() * 60000);
    const nd = new Date(utc + (3600000 * offset));
    const chatTime = new Date(nd.getTime() + (3600000 * offset));
    return chatTime;
};

function generateTimeString(){
    const date = new Date();
    const offset = 8;
    const utc = date.getTime() + (date.getTimezoneOffset() * 60000);
    const nd = new Date(utc + (3600000 * offset));
    const hkTime = new Date(nd.getTime() + (3600000 * offset));
    const timeString = hkTime.toISOString().replace(/T/, " ").replace(/Z$/, "+08:00");
    return timeString;
};

function generateIDByTime(){
    const date = new Date();
    const year = date.getUTCFullYear().toString();
    const month = (date.getUTCMonth() + 1).toString().padStart(2, '0');
    const day = date.getUTCDate().toString().padStart(2, '0');
    const hours = date.getUTCHours().toString().padStart(2, '0');
    const minutes = date.getUTCMinutes().toString().padStart(2, '0');
    const seconds = date.getUTCSeconds().toString().padStart(2, '0');
    const milliseconds = date.getUTCMilliseconds().toString().padStart(3, '0');
    const hkTime = year + month + day + hours + minutes + seconds + milliseconds;
    const timeID = parseInt(hkTime);
    return timeID;
};

module.exports = {
    client,
    ObjectId,
    s3,
    oauthClient,
    authenticateJWT,
    generateTime,
    generateChatTime,
    generateTimeString,
    generateIDByTime
};