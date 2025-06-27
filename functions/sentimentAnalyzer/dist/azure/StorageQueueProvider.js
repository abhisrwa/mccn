"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StorageQueueProvider = void 0;
const storage_queue_1 = require("@azure/storage-queue");
const config_1 = __importDefault(require("../config/config"));
class StorageQueueProvider {
    async sendMessageToQueue(message) {
        let response;
        console.log('HTTP trigger function processed a request.');
        const queueName = config_1.default.azqueue.queuename;
        const connectionString = config_1.default.azqueue.queueurl;
        if (!connectionString) {
            response = {
                status: 500,
                body: "Azure Storage connection string is missing. Ensure the 'AzureWebJobsStorage' application setting is configured."
            };
            return response; // Return the response here
        }
        try {
            const queueServiceClient = storage_queue_1.QueueServiceClient.fromConnectionString(connectionString);
            const queueClient = queueServiceClient.getQueueClient(queueName); // Type inferred by TypeScript
            if (message) {
                const enqueueResult = await queueClient.sendMessage(message);
                console.log(`Enqueued message ID: ${enqueueResult.messageId}`);
                response = {
                    status: 200,
                    body: `Message "${message}" enqueued successfully with ID: ${enqueueResult.messageId}`
                };
            }
            else {
                response = {
                    status: 400,
                    body: "Please pass a 'message' in the request body or query string."
                };
            }
        }
        catch (error) { // Catching 'any' is common for errors, but you could be more specific if you know the error types
            console.log("Error sending message to queue:", error);
            response = {
                status: 500,
                body: `Error sending message to queue: ${error.message || String(error)}`
            };
        }
        return response;
    }
}
exports.StorageQueueProvider = StorageQueueProvider;
