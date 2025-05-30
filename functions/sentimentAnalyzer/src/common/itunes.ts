import axios from 'axios';
import Sentiment from 'sentiment';
import * as summarizer from './summarize'; // Assuming summarize.ts exports functions
import config from '../config/config'; // Assuming config.ts exports an object

// Define an interface for the structure of a single review entry from the iTunes API
export interface AppReviewEntry {
    content: {
        label: string; // The actual review content
        attributes: {
            type: string;
        };
    };
    // Add other properties you might use from the entry if needed, e.g.:
    // 'im:name': { label: string };
    // 'im:rating': { label: string };
    // id: { label: string };
    // title: { label: string };
    // author: { name: { label: string } };
}

const sentiment = new Sentiment();

async function getAppReviews(): Promise<AppReviewEntry[] | undefined> {
    try {
        // You might want to define a more specific interface for the full response if you use more of it
        const response = await axios.get<{ feed: { entry: AppReviewEntry[] } }>(`https://itunes.apple.com/us/rss/customerreviews/id=${config.appId}/json`);
        console.log('Received app reviews');
        const feeds: AppReviewEntry[] = response.data.feed.entry;
        return feeds;
    } catch (error: any) { // Use 'any' for error for simplicity, or a more specific error type if known
        console.error('Error fetching app reviews:', error.message || error); // Log error in a more informative way
        return undefined; // Indicate that no feeds were retrieved on error
    }
}

async function getSentimentAnalysis(feeds: AppReviewEntry[]): Promise<any | undefined> { // Assuming summarizer.getReviewSummary returns 'any' or a specific type
    let summary: any; // Type for summary depends on what summarizer.getReviewSummary returns
    try {
        let comment: string = '';
        feeds.forEach((element: AppReviewEntry) => {
            // Ensure element.content exists and has a label property
            if (element.content && element.content.label) {
                comment += ". " + element.content.label;
            }
        });
        console.log('trying to get summaries', comment);
        // Assuming getReviewSummary exists on the summarizer object and returns a promise
        summary = await summarizer.getReviewSummary(comment);
        console.log('summary received', summary);
    } catch (error: any) {
        console.error('Error getting sentiment analysis:', error.message || error);
        return undefined;
    }
    return summary;
}

export {
    getAppReviews,
    getSentimentAnalysis
};