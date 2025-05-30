import { IDatabaseProvider } from '../interfaces/IDatabaseProvider';
import { IQueueProvider } from '../interfaces/IQueueProvider';
import { stringToTimeString } from '../utils';
import { AppReviewEntry, getAppReviews, getSentimentAnalysis } from "../common/itunes";
import config from "../config/config";
import { ISecretsProvider } from '../interfaces/ISecretsProvider';

export class ReviewService {
    
    constructor(
        private dbProvider: IDatabaseProvider,
        private qProvider: IQueueProvider
    ) {}

    async process() {
        const reviews:AppReviewEntry[] | undefined = await getAppReviews();
        await this.saveAppReviews(config.appId, reviews, config.cosmosdb.containerId);
        console.log('Saved reviews');
        let sentAnalysis = '';
        if (reviews) {
            sentAnalysis = await getSentimentAnalysis(reviews);
            console.log('summary retrieved', sentAnalysis);            
            await this.saveSummary(config.appId, sentAnalysis, config.cosmosdb.summcontainerId);
            await this.qProvider.sendMessageToQueue(JSON.stringify({ message: 'Done'}));
        }
        return sentAnalysis;
    }

    async saveAppReviews(appId: string, appReviews: any, tableName: string) {
        const platform = process.env.PLATFORM || 'azure'
        if (platform === 'aws') {
            for (const item of appReviews) {
                try {
                    const ts = item.updated.label;
                    const newItem = {
                        "PK": { S : "APP#" + appId },
                        "SK": { S: "CR#" + stringToTimeString(ts) },
                        "id": { S:item.id.label },
                        "title": { S : item.title.label },
                        "content": { S : item.content.label },
                        "updated": { S : item.updated.label }
                    };
                    //console.log(newItem);
                    await this.dbProvider.createItem(newItem, tableName);
                } catch (error) {
                    console.error('Error processing item:', error);
                }
            }
        } else if (platform === 'azure') {
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
                } catch (error) {
                    console.error('Error processing item:', error);
                }
            }
        }
    }

    async saveSummary(appId: string, summary: string, tableName: string) {
        const platform = process.env.PLATFORM || 'azure';
        let newItem = {};
        if (platform === 'aws') {
            newItem = {
                "PK": { S : "APP#" + appId },
                "SK": { S: "SUMM#" + new Date().getTime() },
                "summary": { S : summary },
                "updated": { S : new Date() }
            };                
        } else if (platform === 'azure') {
            newItem = {
                id: config.appId,
                summary,
                updated: new Date().getTime()
            };
        }
        try {
            await this.dbProvider.createItem(newItem, tableName);
        } catch (error) {
            console.error('Error processing item:', error);
        }
    }
}
