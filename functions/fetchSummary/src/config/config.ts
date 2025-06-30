const config: AppConfig = {
    appId: process.env.APPID || '389801252',
    cosmosdb: {
        endpoint: process.env.DB_ENDPOINT || 'AccountEndpoint',
        key: process.env.DB_KEY || 'AB8C',
        databaseId: process.env.DB_ID || 'cosmicworks',
        containerId: process.env.DB_CONTAINERID || 'customerreviews',
        summcontainerId: process.env.DB_SUMMCONTAINERID || 'reviewsummary'
    },
    awsregion: process.env.REGION || 'eu-north-1',
    sqsURL: process.env.SQSURL || 'https',
    ddb: {
        reviewtable: process.env.DB_REVIEW_TABLE || 'customerreviews',
        summarytable: process.env.DB_SUMM_TABLE || 'reviewsummary'
    },
    azqueue: {
        queuename: process.env.AZQUEUE_NAME || 'js-queue-items',
        queueurl: process.env.AZQUEUE_URL || 'DefaultEndpointsProtocol'
    },
    vault: process.env.KEY_VAULT_URL || 'http',
    clientID: process.env.CLIENT_ID || 'cc74bc7'
};
