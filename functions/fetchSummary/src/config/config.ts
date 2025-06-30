const config: AppConfig = {
    appId: process.env.APPID || '389801252',
    cosmosdb: {
        endpoint: process.env.DB_ENDPOINT || 'AccountEndpoint=https://learning-cath.documents.azure.com:443/;AccountKey=AB8CEDpJbFY5dA7ARUBh5A0dzsyKxEf6WnfJlKmdOurHjU2154mXh8VG9tBYzm1GO50KE9u4YGHIACDbRUQTwQ==',
        key: process.env.DB_KEY || 'AB8CEDpJbFY5dA7ARUBh5A0dzsyKxEf6WnfJlKmdOurHjU2154mXh8VG9tBYzm1GO50KE9u4YGHIACDbRUQTwQ==',
        databaseId: process.env.DB_ID || 'cosmicworks',
        containerId: process.env.DB_CONTAINERID || 'customerreviews',
        summcontainerId: process.env.DB_SUMMCONTAINERID || 'reviewsummary'
    },
    awsregion: process.env.REGION || 'eu-north-1',
    sqsURL: process.env.SQSURL || 'https://sqs.eu-north-1.amazonaws.com/767398089028/SummaryNotnQueue.fifo',
    ddb: {
        reviewtable: process.env.DB_REVIEW_TABLE || 'customerreviews',
        summarytable: process.env.DB_SUMM_TABLE || 'reviewsummary'
    },
    azqueue: {
        queuename: process.env.AZQUEUE_NAME || 'js-queue-items',
        queueurl: process.env.AZQUEUE_URL || 'DefaultEndpointsProtocol=https;AccountName=cathstorageacc;AccountKey=s24XQd9/TVsNOj8Fa9Axdhy6yWU2UJ/ffj8kJmTZGPzyHPPlC9r6LsCuhFoqDUrXifzntDr0Y/81+AStq3kIMg==;EndpointSuffix=core.windows.net'
    },
    vault: process.env.KEY_VAULT_URL || 'https://sentiment.vault.azure.net/',
    clientID: process.env.CLIENT_ID || 'cc74bc7'
};
