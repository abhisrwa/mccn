// config.ts
interface AzureQueueConfig {
    queuename: string;
    queueurl: string;
}

interface AppConfig {
    sgapikey: string;
    tomailid: string;
    awsregion: string;
    sqsURL: string;
    azqueue: AzureQueueConfig;
    frommailid: string;
    vault: string;
    clientID: string;
}

const config: AppConfig = {
    sgapikey : process.env.SENDGRID_API_KEY,
    tomailid : process.env.TO_EMAIL,
    frommailid : process.env.FROM_EMAIL,
    awsregion: process.env.REGION || 'eu-north-1',
    sqsURL: process.env.SQSURL,
    azqueue: {
        queuename: process.env.AZQUEUE_NAME || 'js-queue-items',
        queueurl: 'AzureWebJobsStorage'
    },
    vault: process.env.KEY_VAULT_URL,
    clientID: process.env.CLIENT_ID
};

export default config;