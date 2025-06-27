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
    vault: string;
    clientID: string;
}

// Helper function to validate required environment variables
function getRequiredEnv(name: string): string {
    const value = process.env[name];
    if (!value) throw new Error(`Missing required environment variable: ${name}`);
    return value;
}

const config: AppConfig = {
    appId: getRequiredEnv('APPID'),
    cosmosdb: {
        endpoint: getRequiredEnv('DB_ENDPOINT'),
        key: getRequiredEnv('DB_KEY'),
        databaseId: process.env.DB_ID || 'cosmicworks',
        containerId: process.env.DB_CONTAINERID || 'customerreviews',
        summcontainerId: process.env.DB_SUMMCONTAINERID || 'reviewsummary'
    },
    awsregion: process.env.REGION || 'eu-north-1',
    sqsURL: getRequiredEnv('SQSURL'),
    ddb: {
        reviewtable: process.env.DB_REVIEW_TABLE || 'customerreviews',
        summarytable: process.env.DB_SUMM_TABLE || 'reviewsummary'
    },
    azqueue: {
        queuename: process.env.AZQUEUE_NAME || 'js-queue-items',
        queueurl: getRequiredEnv('AZQUEUE_URL')
    },
    vault: getRequiredEnv('KEY_VAULT_URL'),
    clientID: getRequiredEnv('CLIENT_ID')
};

export default config;
