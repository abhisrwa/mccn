"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAppReviews = getAppReviews;
exports.getSentimentAnalysis = getSentimentAnalysis;
exports.getORSentimentAnalysis = getORSentimentAnalysis;
const axios_1 = __importDefault(require("axios"));
const sentiment_1 = __importDefault(require("sentiment"));
const summarizer = __importStar(require("./summarize")); // Assuming summarize.ts exports functions
const openrouterclient_1 = require("./openrouterclient");
const sentiment = new sentiment_1.default();
async function getAppReviews(appId) {
    try {
        // You might want to define a more specific interface for the full response if you use more of it
        const response = await axios_1.default.get(`https://itunes.apple.com/us/rss/customerreviews/id=${appId}/json`);
        console.log('Received app reviews');
        const feeds = response.data.feed.entry;
        return feeds;
    }
    catch (error) { // Use 'any' for error for simplicity, or a more specific error type if known
        console.error('Error fetching app reviews:', error.message || error); // Log error in a more informative way
        return undefined; // Indicate that no feeds were retrieved on error
    }
}
async function getSentimentAnalysis(feeds) {
    let summary; // Type for summary depends on what summarizer.getReviewSummary returns
    try {
        let comment = '';
        feeds.forEach((element) => {
            // Ensure element.content exists and has a label property
            if (element.content && element.content.label) {
                comment += ". " + element.content.label;
            }
        });
        console.log('trying to get summaries', comment);
        // Assuming getReviewSummary exists on the summarizer object and returns a promise
        summary = await summarizer.getReviewSummary(comment);
        console.log('summary received', summary);
    }
    catch (error) {
        console.error('Error getting sentiment analysis:', error.message || error);
        return undefined;
    }
    return summary;
}
async function getORSentimentAnalysis(feeds) {
    let summary; // Type for summary depends on what summarizer.getReviewSummary returns
    try {
        let comment = '';
        let reviews = [];
        feeds.forEach((element) => {
            // Ensure element.content exists and has a label property
            if (element.content && element.content.label) {
                comment += ". " + element.content.label;
            }
            reviews.push({ id: element.id.label, text: element.content.label });
        });
        summary = await (0, openrouterclient_1.summarize)(comment);
        console.log('summary received', summary);
    }
    catch (error) {
        console.error('Error getting sentiment analysis:', error.message || error);
        return undefined;
    }
    return summary;
}
