"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config = {
    sgapikey: process.env.SENDGRID_API_KEY,
    tomailid: process.env.TO_EMAIL,
    frommailid: process.env.FROM_EMAIL,
    awsregion: process.env.REGION || 'eu-north-1',
    sqsURL: process.env.SQSURL,
    azqueue: {
        queuename: process.env.AZQUEUE_NAME || 'js-queue-items',
        queueurl: 'AzureWebJobsStorage'
    }
};
exports.default = config;
