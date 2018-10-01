const yargs = require('yargs');

/**
 * @name endOfLine
 * @description file system end of line
 */
const endOfLine = require('os').EOL;

/**
 * @name tab
 * @description file system tab
 */
const tab = "\t";

/**
 * To Title Case
 * @name toTitleCase
 * @description converts string to title case, firts letter of each word to uppercase
 * @param {string} str - string to convert
 */
function toTitleCase(str) {
    return str.replace(/\w\S*/g, function (txt) {
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
}

/**
 * Get template extension
 * @name getTemplateExtension
 * @description gets the template extension
 * @param {string} str - source string
 */
function getExtension(str) {
    let nameComponents = str.split('.');
    return nameComponents[nameComponents.length - 2]
}

/**
 * Show help
 * @name showHelp
 * @description show help message and yargs help
 * @param {string} message - message to show to the user
 */
function showHelp(message) {
    console.log(message);
    yargs.showHelp();
}

module.exports = {
    toTitleCase,
    getExtension,
    showHelp,
    endOfLine,
    tab
};