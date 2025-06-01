"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SQSProvider = void 0;
const client_sqs_1 = require("@aws-sdk/client-sqs");
const config_1 = __importDefault(require("../config/config"));
class SQSProvider {
    constructor() {
        this.sqsClient = new client_sqs_1.SQSClient({ region: config_1.default.awsregion });
        this.queueURL = config_1.default.sqsURL;
    }
    async sendMessageToQueue(messageBody) {
        const params = {
            DelaySeconds: 0, // Optional: The number of seconds to delay the delivery of the message (0-900). Default is 0.
            MessageBody: messageBody,
            QueueUrl: this.queueURL,
            MessageGroupId: 'SENTIMENT_ANALYSIS'
        };
        try {
            const command = new client_sqs_1.SendMessageCommand(params);
            const data = await this.sqsClient.send(command);
            console.log('Success, message ID:', data.MessageId);
            return data.MessageId;
        }
        catch (err) { // Type 'any' is used here for broader error handling. Consider more specific error types if known.
            console.error('Error sending message:', err);
            // Optionally, rethrow the error or handle it more specifically
            return undefined;
        }
    }
}
exports.SQSProvider = SQSProvider;
