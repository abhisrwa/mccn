"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailService = void 0;
const mail_1 = __importDefault(require("@sendgrid/mail"));
const config_1 = __importDefault(require("../config/config"));
class EmailService {
    constructor(sgapikey) {
        mail_1.default.setApiKey(sgapikey);
    }
    async send() {
        // Get email details from the event object or use defaults/environment variables
        const toEmail = config_1.default.tomailid; // Recipient email address
        const fromEmail = config_1.default.frommailid; // Verified Sender email address
        const subject = 'Email from function using SendGrid Library';
        const textBody = 'This is the plain text content.';
        const htmlBody = '<p>This is the <strong>HTML</strong> content.</p>';
        if (!fromEmail || !toEmail) {
            console.error("Missing required information: API Key, From Email, or To Email.");
            return {
                statusCode: 400,
                body: JSON.stringify({ message: 'Missing SendGrid API Key, sender email, or recipient email.' }),
            };
        }
        const msg = {
            to: toEmail,
            from: fromEmail,
            subject: subject,
            text: textBody,
            html: htmlBody,
        };
        try {
            await mail_1.default.send(msg);
            console.log('Email sent successfully using @sendgrid/mail');
        }
        catch (error) { // Catching as 'any' for now, you can refine error type if needed
            console.error('Error sending email:', error.response ? error.response.body : error);
            return {
                statusCode: error.code || 500,
                body: JSON.stringify({ message: 'Failed to send email', error: error.message }),
            };
        }
    }
}
exports.EmailService = EmailService;
