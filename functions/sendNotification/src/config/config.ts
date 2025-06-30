const config: AppConfig = {
    sgapikey : process.env.SENDGRID_API_KEY || 'SG.eU',
    tomailid : process.env.TO_EMAIL || 'swismit',
    frommailid : process.env.FROM_EMAIL || 'abhi1',
    awsregion: process.env.REGION || 'eu-north-1',
    sqsURL: process.env.SQSURL || 'https',
    azqueue: {
        queuename: process.env.AZQUEUE_NAME || 'js-queue-items',
        queueurl: 'AzureWebJobsStorage'
    },
    vault: process.env.KEY_VAULT_URL || 'https',
    clientID: process.env.CLIENT_ID || 'cc74bc7c'
};
