import moment from 'moment';
/**
 * Resolves promises and handles any success or error cases
 * 
 * @param {Promise} promise - Promise to resolve
 *
 * @return {Promise<any>} Promise that resolves a anything
 *
 * @example
 *
 *     await callout(promise);
 */
export async function callout (promise: Promise<any>): Promise<any> {
    return promise
        .then(data => [null, data])
        .catch(err => [err]);
}
/**
 * Prepends a time before logging message to console
 * 
 * @param {string} message - Content log to console
 *
 * @return {void} Returns nothing
 *
 * @example
 *
 *     log(message);
 */
export function log (message: string): void {
    console.log(`${moment().format('YYYY-MM-DD kk:mm:ss').green} ${message}`);
}

