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

// Helper function to validate required environment variables
function getRequiredEnv(name: string): string {
    const value = process.env[name];
    if (!value) throw new Error(`Missing required environment variable: ${name}`);
    return value;
}

const config: AppConfig = {
    sgapikey : getRequiredEnv('SENDGRID_API_KEY'),
    tomailid : getRequiredEnv('TO_EMAIL'),
    frommailid : getRequiredEnv('FROM_EMAIL'),
    awsregion: process.env.REGION || 'eu-north-1',
    sqsURL: getRequiredEnv('SQSURL'),
    azqueue: {
        queuename: process.env.AZQUEUE_NAME || 'js-queue-items',
        queueurl: 'AzureWebJobsStorage'
    },
    vault: getRequiredEnv('KEY_VAULT_URL'),
    clientID: getRequiredEnv('CLIENT_ID')
};

export default config;
