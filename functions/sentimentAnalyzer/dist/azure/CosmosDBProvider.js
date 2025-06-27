"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CosmosDBProvider = void 0;
const cosmos_1 = require("@azure/cosmos");
const config_1 = __importDefault(require("../config/config"));
class CosmosDBProvider {
    constructor(connectionString) {
        this.cosmosConfig = config_1.default.cosmosdb;
        this.databaseId = this.cosmosConfig.databaseId;
        this.client = new cosmos_1.CosmosClient(connectionString);
    }
    /**
     * Gets or creates the database and container.
     * @param containerId The ID of the container to get or create.
     * @returns A promise that resolves to an object containing the database and container.
     */
    async getDatabaseAndContainer(containerId) {
        const { database } = await this.client.databases.createIfNotExists({
            id: this.databaseId,
        });
        const { container } = await database.containers.createIfNotExists({
            id: containerId,
            partitionKey: { paths: ["/id"] }, // Partition key is IMPORTANT for scalability
        });
        return { database, container };
    }
    // CRUD Operations
    /**
     * Creates an item in the container.
     * @param container The Cosmos DB Container object.
     * @param item The item to create. Must include an 'id' property.
     * @returns A promise that resolves when the item is created.
     */
    async createItem(item, table) {
        try {
            const { container } = await this.getDatabaseAndContainer(table);
            const { resource } = await container.items.create(item);
            return { resource }; // Type assertion as create returns ResourceResponse
        }
        catch (error) {
            console.error("Error creating item:", error);
            throw error; // Re-throw the error for the caller to handle
        }
    }
    /**
     * Updates an item in the container.
     * @param container The Cosmos DB Container object.
     * @param item The updated item. Must include the 'id' of the item to update.
     * @returns A promise that resolves when the item is updated.
     */
    async updateItem(container, item) {
        try {
            const { resource } = await container.item(item.id, item.id).replace(item); // Partition key must be included in the item
            console.log("Item updated:", resource);
            return { resource }; // Type assertion as replace returns ResourceResponse
        }
        catch (error) {
            console.error("Error updating item:", error);
            throw error; // Re-throw the error for the caller to handle
        }
    }
    /**
     * Deletes an item from the container by its id.
     * @param container The Cosmos DB Container object.
     * @param id The id of the item to delete.
     * @param partitionKey The partition key value for the item.
     * @returns A promise that resolves when the item is deleted.
     */
    async deleteItem(container, id, partitionKey) {
        try {
            const { statusCode } = await container.item(id, partitionKey).delete();
            console.log("Item deleted. Status code:", statusCode);
            return { statusCode };
        }
        catch (error) {
            console.error("Error deleting item:", error);
            throw error; // Re-throw the error for the caller to handle
        }
    }
    /**
     * Lists all items in the container. Use this cautiously in production with large datasets.
     * @param container The Cosmos DB Container object.
     * @returns A promise that resolves to an array of items.
     */
    async listItems(container) {
        try {
            const { resources } = await container.items.readAll().fetchAll();
            return resources;
        }
        catch (error) {
            console.error("Error listing items:", error);
            throw error; // Important: Re-throw the error so the caller knows.
        }
    }
}
exports.CosmosDBProvider = CosmosDBProvider;
