"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getReviewSummary = getReviewSummary;
// 1. Import statement
const node_summarizer_1 = require("node-summarizer");
/**
 * Generates a summary of customer reviews using the node-summarizer library.
 *
 * @param customerReviews The string containing all customer reviews to be summarized.
 * @returns A promise that resolves to the summarized text (string) or an empty string if an error occurs.
 */
async function getReviewSummary(customerReviews) {
    try {
        // 2. Type instantiation for SummarizerManager
        // Assuming SummarizerManager's constructor takes a string and a number.
        const summarizer = new node_summarizer_1.SummarizerManager(customerReviews, 2);
        // 3. Type assertion for the result of getSummaryByRank if needed,
        // or rely on inferred types if @types/node-summarizer is available.
        const summary = await summarizer.getSummaryByRank();
        console.log('Summary retrieved', summary);
        // Ensure summary and summary.summary exist before accessing
        return summary && summary.summary ? summary.summary : '';
    }
    catch (error) { // Catching 'any' for errors, consider more specific error handling if possible.
        console.error('Error in getReviewSummary:', error); // Using console.error for errors
        return ''; // Return an empty string on error to indicate no summary was generated.
    }
}
