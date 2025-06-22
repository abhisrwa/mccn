"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
const SecretsManagerProvider_1 = require("./aws/SecretsManagerProvider");
const KeyVaultProvider_1 = require("./azure/KeyVaultProvider");
const EmailService_1 = require("./services/EmailService");
/**
 * A simple function that processes an SQS event or Queue trigger.
 * It sends the notification of summary.
 *
 * @param queueItem The SQS event/Queue Trigger.
 * @param context The Lambda context object.
 * @returns A Promise that resolves to an API Gateway proxy result.
 */
const handler = async (queueItem, context) => {
    const platform = process.env.PLATFORM || 'azure';
    let responseBody;
    let statusCode = 200;
    const headers = {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*', // CORS for API Gateway
    };
    try {
        let secProvider;
        let sgapikey = '';
        // Handling request based on platform
        if (platform === 'azure') {
            secProvider = new KeyVaultProvider_1.KeyVaultProvider();
            sgapikey = await secProvider.getSecret('sgKey');
            console.log('Storage queue function processed work item:', sgapikey);
        }
        else if (platform === 'aws') {
            secProvider = new SecretsManagerProvider_1.SecretsManagerProvider();
            const sgsecret = await secProvider.getSecret('poc/sentiment');
            console.log('Storage queue function processed work item:', sgsecret);
            const { sgKey } = JSON.parse(sgsecret);
            sgapikey = sgKey;
            console.log('Storage queue function processed work item:', sgapikey);
        }
        else {
            console.log("Platform not supported");
        }
        const emailService = new EmailService_1.EmailService(sgapikey);
        await emailService.send();
        console.log('Processed');
        responseBody = {
            message: 'Email sent successfully!'
        };
    }
    catch (error) {
        console.error('Error processing event:', error);
        statusCode = 400; // Bad Request
        responseBody = {
            message: 'Failed to process request.',
            error: error.message || 'An unknown error occurred.',
        };
    }
    return {
        statusCode,
        headers,
        body: JSON.stringify(responseBody),
    };
};
exports.handler = handler;
