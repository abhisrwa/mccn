"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SummaryService = void 0;
const config_1 = __importDefault(require("../config/config"));
class SummaryService {
    constructor(dbProvider) {
        this.dbProvider = dbProvider;
    }
    async process() {
        const appId = config_1.default.appId;
        const platform = process.env.PLATFORM || 'azure';
        let summary = '';
        const record = await this.dbProvider.getLatestItem({ S: "APP#" + appId }, config_1.default.cosmosdb.summcontainerId);
        if (platform === 'azure') {
            summary = record.summary;
        }
        else {
            summary = record.summary;
        }
        return summary;
    }
}
exports.SummaryService = SummaryService;
