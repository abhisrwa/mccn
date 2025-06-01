"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DynamoDBProvider = void 0;
const client_dynamodb_1 = require("@aws-sdk/client-dynamodb");
const util_dynamodb_1 = require("@aws-sdk/util-dynamodb");
const config_1 = __importDefault(require("../config/config"));
class DynamoDBProvider {
    constructor() {
        // Configure AWS SDK v3
        this.client = new client_dynamodb_1.DynamoDBClient({
            region: config_1.default.awsregion,
        });
        /**
         * Helper function to handle errors
         * @param err The error object
         * @returns Throws the error
         */
        this.handleError = (err) => {
            console.error("Error:", err);
            throw err;
        };
    }
    /**
     * Creates (Puts) a new item into a DynamoDB table.
     * @param item The item to create. This should be a plain JavaScript object.
     * @param tableName The name of the DynamoDB table.
     * @returns The result of the PutItemCommand.
     */
    async createItem(item, tableName) {
        const params = {
            TableName: tableName,
            Item: item,
        };
        try {
            const command = new client_dynamodb_1.PutItemCommand(params);
            const result = await this.client.send(command);
            console.log("Item Created:", result);
            return result;
        }
        catch (error) {
            return this.handleError(error);
        }
    }
    /**
     * Reads (Gets) an item from a DynamoDB table.
     * @param key The primary key of the item to retrieve.
     * @param tableName The name of the DynamoDB table.
     * @returns The unmarshalled item if found, otherwise null.
     */
    async getItem(key, tableName) {
        const params = {
            TableName: tableName,
            Key: (0, util_dynamodb_1.marshall)(key),
        };
        try {
            const command = new client_dynamodb_1.GetItemCommand(params);
            const result = await this.client.send(command);
            if (result.Item) {
                const unmarshalledItem = (0, util_dynamodb_1.unmarshall)(result.Item);
                console.log("Item Retrieved:", unmarshalledItem);
                return unmarshalledItem;
            }
            else {
                console.log("Item not found.");
                return null;
            }
        }
        catch (error) {
            return this.handleError(error);
        }
    }
    /**
     * Updates an item in a DynamoDB table.
     * @param key The primary key of the item to update.
     * @param updateExpression The update expression.
     * @param expressionAttributeValues The values for the update expression.
     * @param returnValues Specifies what values to return. Defaults to "ALL_NEW".
     * @param tableName The name of the DynamoDB table.
     * @returns The unmarshalled updated item, or null if no attributes were returned.
     */
    async updateItem(key, updateExpression, expressionAttributeValues, tableName, returnValues = "ALL_NEW") {
        const params = {
            TableName: tableName,
            Key: (0, util_dynamodb_1.marshall)(key),
            UpdateExpression: updateExpression,
            ExpressionAttributeValues: (0, util_dynamodb_1.marshall)(expressionAttributeValues),
            ReturnValues: returnValues,
        };
        try {
            const command = new client_dynamodb_1.UpdateItemCommand(params);
            const result = await this.client.send(command);
            console.log("Item Updated:", result);
            const updatedItem = result.Attributes
                ? (0, util_dynamodb_1.unmarshall)(result.Attributes)
                : null;
            return updatedItem;
        }
        catch (error) {
            return this.handleError(error);
        }
    }
    /**
     * Deletes an item from a DynamoDB table.
     * @param key The primary key of the item to delete.
     * @param tableName The name of the DynamoDB table.
     * @returns The result of the DeleteItemCommand.
     */
    async deleteItem(key, tableName) {
        const params = {
            TableName: tableName,
            Key: (0, util_dynamodb_1.marshall)(key),
        };
        try {
            const command = new client_dynamodb_1.DeleteItemCommand(params);
            const result = await this.client.send(command);
            console.log("Item Deleted:", result);
            return result;
        }
        catch (error) {
            return this.handleError(error);
        }
    }
    /**
     * Queries a DynamoDB table by its partition key.
     * @param partitionKeyValue The value of the partition key.
     * @param tableName The name of the DynamoDB table.
     * @param partitionKeyName The name of the partition key attribute. Defaults to "PK".
     * @returns An array of unmarshalled items matching the query, or null if an error occurs.
     */
    async queryDynamoDBByPartitionKey(partitionKeyValue, // Use AttributeValue for values in DynamoDB expressions
    tableName, partitionKeyName = "PK") {
        const params = {
            TableName: tableName,
            KeyConditionExpression: `#PK = :pk_value`,
            ExpressionAttributeNames: {
                "#PK": partitionKeyName,
            },
            ExpressionAttributeValues: {
                ":pk_value": partitionKeyValue,
            },
        };
        try {
            const command = new client_dynamodb_1.QueryCommand(params);
            const result = await this.client.send(command);
            console.log("Query succeeded.");
            console.log("Retrieved items:", result.Items);
            return result.Items ? result.Items.map((item) => (0, util_dynamodb_1.unmarshall)(item)) : [];
        }
        catch (err) {
            console.error("Unable to query. Error JSON:", JSON.stringify(err, null, 2));
            return this.handleError(err); // Ensure errors are handled consistently
        }
    }
}
exports.DynamoDBProvider = DynamoDBProvider;
