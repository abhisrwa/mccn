const config: AppConfig = {
    sgapikey : process.env.SENDGRID_API_KEY || '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',
    tomailid : process.env.TO_EMAIL || 'swismitha@yahoo.co.in',
    frommailid : process.env.FROM_EMAIL || 'abhi1999rwa@gmail.com',
    awsregion: process.env.REGION || 'eu-north-1',
    sqsURL: process.env.SQSURL || 'https://sqs.eu-north-1.amazonaws.com/767398089028/SummaryNotnQueue.fifo',
    azqueue: {
        queuename: process.env.AZQUEUE_NAME || 'js-queue-items',
        queueurl: 'AzureWebJobsStorage'
    },
    vault: process.env.KEY_VAULT_URL || 'https://sentiment.vault.azure.net/',
    clientID: process.env.CLIENT_ID || 'cc74bc7c'
};
