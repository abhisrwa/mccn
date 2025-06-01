"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.KeyVaultProvider = void 0;
const keyvault_secrets_1 = require("@azure/keyvault-secrets");
const identity_1 = require("@azure/identity");
const config_1 = __importDefault(require("../config/config"));
class KeyVaultProvider {
    constructor() {
        const url = config_1.default.vault;
        const credential = new identity_1.DefaultAzureCredential({
            managedIdentityClientId: 'cc74bc7c-f286-4919-9fda-31d37161d9ca'
        });
        this.client = new keyvault_secrets_1.SecretClient(url, credential);
    }
    async getSecret(name) {
        const secret = await this.client.getSecret(name);
        return secret.value;
    }
}
exports.KeyVaultProvider = KeyVaultProvider;
