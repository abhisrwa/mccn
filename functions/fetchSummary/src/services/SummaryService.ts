import { IDatabaseProvider } from '../interfaces/IDatabaseProvider';
import config from "../config/config";

export class SummaryService {
    
    constructor(
        private dbProvider: IDatabaseProvider
    ) {}

    async process() {
        const appId = config.appId;
        const platform = process.env.PLATFORM || 'azure';
        const summary = await this.dbProvider.getLatestItem({ S : "APP#" + appId }, config.cosmosdb.summcontainerId);
        return summary;
    }
}
