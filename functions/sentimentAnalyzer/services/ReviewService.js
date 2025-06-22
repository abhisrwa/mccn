"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReviewService = void 0;
const utils_1 = require("../utils");
const itunes_1 = require("../common/itunes");
const config_1 = __importDefault(require("../config/config"));
const crypto_1 = require("crypto");
class ReviewService {
    constructor(dbProvider, qProvider) {
        this.dbProvider = dbProvider;
        this.qProvider = qProvider;
    }
    async process(appId) {
        const reviews = await (0, itunes_1.getAppReviews)(appId);
        await this.saveAppReviews(appId, reviews, config_1.default.cosmosdb.containerId);
        console.log('Saved reviews');
        let sentAnalysis = '';
        if (reviews) {
            sentAnalysis = await (0, itunes_1.getSentimentAnalysis)(reviews);
            console.log('summary retrieved', sentAnalysis);
            await this.saveSummary(appId, sentAnalysis, config_1.default.cosmosdb.summcontainerId);
            await this.qProvider.sendMessageToQueue(JSON.stringify({ message: 'Done' }));
        }
        return sentAnalysis;
    }
    async saveAppReviews(appId, appReviews, tableName) {
        const platform = process.env.PLATFORM || 'azure';
        if (platform === 'aws') {
            for (const item of appReviews) {
                try {
                    const ts = item.updated.label;
                    const newItem = {
                        "PK": { S: "APP#" + appId },
                        "SK": { S: "CR#" + (0, utils_1.stringToTimeString)(ts) },
                        "id": { S: item.id.label },
                        "title": { S: item.title.label },
                        "content": { S: item.content.label },
                        "updated": { S: item.updated.label }
                    };
                    //console.log(newItem);
                    await this.dbProvider.createItem(newItem, tableName);
                }
                catch (error) {
                    console.error('Error processing item:', error);
                }
            }
        }
        else if (platform === 'azure') {
            for (const item of appReviews) {
                try {
                    const newItem = {
                        id: item.id.label,
                        title: item.title.label,
                        appId: appId,
                        content: item.content.label,
                        updated: item.updated.label,
                    };
                    await this.dbProvider.createItem(newItem, tableName);
                }
                catch (error) {
                    console.error('Error processing item:', error);
                }
            }
        }
    }
    async saveSummary(appId, summary, tableName) {
        const platform = process.env.PLATFORM || 'azure';
        let newItem = {};
        if (platform === 'aws') {
            newItem = {
                "PK": { S: "APP#" + appId },
                "SK": { S: "SUMM#" + new Date().getTime() },
                "summary": { S: summary },
                "updated": { S: new Date() }
            };
        }
        else if (platform === 'azure') {
            newItem = {
                id: (0, crypto_1.randomUUID)(),
                appId,
                summary,
                updated: new Date().getTime()
            };
        }
        try {
            await this.dbProvider.createItem(newItem, tableName);
        }
        catch (error) {
            console.error('Error processing item:', error);
        }
    }
}
exports.ReviewService = ReviewService;
