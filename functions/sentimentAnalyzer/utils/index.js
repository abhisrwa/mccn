"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.stringToTimeString = stringToTimeString;
/**
 * Converts a date string into its corresponding Unix timestamp (milliseconds since epoch).
 *
 * @param dateString The string representation of a date.
 * @returns The Unix timestamp in milliseconds if the date string is valid,
 * "Invalid Date" if the date string cannot be parsed into a valid date,
 * or "Error: Invalid date string format" if an unexpected error occurs during parsing.
 */
function stringToTimeString(dateString) {
    try {
        const date = new Date(dateString);
        if (isNaN(date.getTime())) {
            // If Date object is invalid, getTime() returns NaN
            return "Invalid Date";
        }
        return date.getTime();
    }
    catch (error) { // Catch block variable should be typed 'any' or 'unknown'
        // This catch block might be less frequently hit by Date constructor itself for invalid formats,
        // as it often results in an "Invalid Date" object.
        // However, it's good practice for unexpected errors.
        return `Error: Invalid date string format - ${error.message}`;
    }
}
// If you are using ES Modules (e.g., with 'type: "module"' in package.json or in frontend frameworks):
// export { stringToTimeString };
// --- Example Usage ---
console.log(`"2023-01-15T10:00:00Z" -> ${stringToTimeString("2023-01-15T10:00:00Z")}`);
console.log(`"2024-05-21" -> ${stringToTimeString("2024-05-21")}`);
console.log(`"invalid-date-string" -> ${stringToTimeString("invalid-date-string")}`);
console.log(`null -> ${stringToTimeString(null)}`); // Simulating null input (TS would warn normally)
console.log(`undefined -> ${stringToTimeString(undefined)}`); // Simulating undefined input
console.log(`"" -> ${stringToTimeString("")}`);
