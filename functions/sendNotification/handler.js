"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
const EmailService_1 = require("./services/EmailService");
/**
 * A simple Lambda function that processes an API Gateway proxy event.
 * It echoes the request body and adds a greeting.
 *
 * @param event The API Gateway proxy event.
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
        let requestBody = null;
        // Handling request based on platform
        if (platform === 'azure') {
            console.log('Storage queue function processed work item:', queueItem);
        }
        else if (platform === 'aws') {
            console.log('Storage queue function processed work item:', queueItem);
        }
        else {
            console.log("Platform not supported");
        }
        const emailService = new EmailService_1.EmailService();
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
