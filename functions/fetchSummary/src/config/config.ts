// config.ts
interface CosmosDBConfig {
    endpoint: string;
    key: string;
    databaseId: string;
    containerId: string;
    summcontainerId: string;
}

interface DynamoDBConfig {
    reviewtable: string;
    summarytable: string;
}

interface AzureQueueConfig {
    queuename: string;
    queueurl: string;
}

interface AppConfig {
    appId: string;
    cosmosdb: CosmosDBConfig;
    awsregion: string;
    sqsURL: string;
    ddb: DynamoDBConfig;
    azqueue: AzureQueueConfig;
    vault: string
}

const config: AppConfig = {
    appId: process.env.APPID,
    cosmosdb: {
        endpoint: process.env.DB_ENDPOINT,
        key: process.env.DB_KEY,
        databaseId: process.env.DB_ID || 'cosmicworks',
        containerId: process.env.DB_CONTAINERID || 'customerreviews',
        summcontainerId: process.env.DB_SUMMCONTAINERID || 'reviewsummary'
    },
    awsregion: process.env.REGION || 'eu-north-1',
    sqsURL: process.env.SQSURL,
    ddb: {
        reviewtable: process.env.DB_REVIEW_TABLE || 'customerreviews',
        summarytable: process.env.DB_SUMM_TABLE || 'reviewsummary'
    },
    azqueue: {
        queuename: process.env.AZQUEUE_NAME || 'js-queue-items',
        queueurl: process.env.AZQUEUE_URL
    },
    vault: process.env.KEY_VAULT_URL
};

export default config;