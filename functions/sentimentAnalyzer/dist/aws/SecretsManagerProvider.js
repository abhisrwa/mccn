"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SecretsManagerProvider = void 0;
const client_secrets_manager_1 = require("@aws-sdk/client-secrets-manager");
const config_1 = __importDefault(require("../config/config"));
class SecretsManagerProvider {
    async getSecret(secretName) {
        const client = new client_secrets_manager_1.SecretsManagerClient({ region: config_1.default.awsregion });
        try {
            const command = new client_secrets_manager_1.GetSecretValueCommand({
                SecretId: secretName,
            });
            const response = await client.send(command);
            if (response.SecretString) {
                return response.SecretString;
            }
            else if (response.SecretBinary) {
                // SecretBinary is a Uint8Array, you might need to decode it
                // depending on its content (e.g., base64 encoded string, raw binary)
                return Buffer.from(response.SecretBinary).toString("utf8");
            }
            else {
                console.warn(`Secret '${secretName}' found, but contains no SecretString or SecretBinary.`);
                return "";
            }
        }
        catch (error) {
            console.error(`Error retrieving secret '${secretName}':`, error);
            // You might want to throw the error or handle it more gracefully based on your application's needs
            throw error;
        }
    }
}
exports.SecretsManagerProvider = SecretsManagerProvider;
