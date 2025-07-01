"use strict";
exports.__esModule = true;
// Enforce required env vars
function requireEnv(name) {
    var value = process.env[name];
    if (!value) {
        throw new Error("Missing required environment variable: ".concat(name));
    }
    return value;
}
// Determine platform
var platform = process.env.PLATFORM || 'aws';
var config = {
    platform: platform,
    sgapikey: requireEnv('SENDGRID_API_KEY'),
    tomailid: requireEnv('TO_EMAIL'),
    frommailid: requireEnv('FROM_EMAIL'),
    awsregion: process.env.REGION || 'eu-north-1',
    sqsURL: platform === 'aws' ? requireEnv('SQSURL') : '',
    azqueue: {
        queuename: platform === 'azure' ? requireEnv('AZQUEUE_NAME') : '',
        queueurl: platform === 'azure' ? requireEnv('AZQUEUE_URL') : ''
    },
    vault: platform === 'azure' ? requireEnv('KEY_VAULT_URL') : '',
    clientID: platform === 'azure' ? requireEnv('CLIENT_ID') : ''
};
exports["default"] = config;
