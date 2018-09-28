const logger = require('./logger');
var errorFolder = __dirname + "\\..\\logs";

/**
 * Handles errors thorugh the application 
 * @name handleError
 * @description logs errors and displays the user a message
 * @param {Object} error - the error to handle
 */
function handleError(error){
    console.log(`An error has occured, please check the log for details! Error message: ${error.message}` );
    logger.logError(error, errorFolder);
}

module.exports = {handleError, errorFolder};
