let AWS = require('aws-sdk');
AWS.config.update({
 "region": "us-east-2",
 "endpoint": "https://dynamodb.us-east-2.amazonaws.com",
 "accessKeyId": "AKIAZJ2CJBGTDKS2ECQC",
 "secretAccessKey": "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"
});

let docClient = new AWS.DynamoDB.DocumentClient();

module.exports = docClient;