"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
const DynamoDBProvider_1 = require("./aws/DynamoDBProvider");
const SQSProvider_1 = require("./aws/SQSProvider");
const CosmosDBProvider_1 = require("./azure/CosmosDBProvider");
const KeyVaultProvider_1 = require("./azure/KeyVaultProvider");
const StorageQueueProvider_1 = require("./azure/StorageQueueProvider");
const ReviewService_1 = require("./services/ReviewService");
/**
 * A simple Lambda function that processes an API Gateway proxy event.
 * It echoes the request body and adds a greeting.
 *
 * @param event The API Gateway proxy event.
 * @param context The Lambda context object.
 * @returns A Promise that resolves to an API Gateway proxy result.
 */
const handler = async (event, context) => {
    const platform = process.env.PLATFORM || 'azure';
    let responseBody;
    let statusCode = 200;
    const headers = {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*', // CORS for API Gateway
    };
    try {
        let requestBody = null;
        let dbProvider = new DynamoDBProvider_1.DynamoDBProvider();
        let qProvider = new StorageQueueProvider_1.StorageQueueProvider();
        // Handling request based on platform
        if (platform === 'azure') {
            let secProvider = new KeyVaultProvider_1.KeyVaultProvider();
            //const connectionString = await secProvider.getSecret('dbconnstring');
            //console.log('Connection string:: ', connectionString);
            dbProvider = new CosmosDBProvider_1.CosmosDBProvider();
            qProvider = new StorageQueueProvider_1.StorageQueueProvider();
            try {
                requestBody = await event.json();
            }
            catch (error) {
                // Body might not be JSON, or empty
                context.log('Request body was not JSON or was empty:', error.message);
                // Fallback to text if needed, or handle as empty
                requestBody = await event.text(); // Or leave as null
            }
        }
        else if (platform === 'aws') {
            dbProvider = new DynamoDBProvider_1.DynamoDBProvider();
            qProvider = new SQSProvider_1.SQSProvider();
            if (!event.body) {
                throw new Error('Request body is missing.');
            }
            requestBody = JSON.parse(event.body);
        }
        else {
            console.log("Platform not supported");
        }
        const reviewService = new ReviewService_1.ReviewService(dbProvider, qProvider);
        const sentAnalysis = await reviewService.process();
        console.log('Processed');
        responseBody = {
            message: sentAnalysis,
            input: requestBody
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
