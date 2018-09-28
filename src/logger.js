const fileSystem = require('fs');
const utility = require('./utility');

/**
 * Writes message to log
 * @name logMessage
 * @description writes the given message to the log with the given path
 * @param {string} message - message to write to the log
 */
function logError(error, folder){
    if (!fileSystem.existsSync(folder)) {
        fileSystem.mkdirSync(folder);
    }

    let date = new Date(Date.now()).toLocaleDateString('de');
    var fileLocation = `${folder}\\log-${date}.txt`;
    let content = fileSystem.readFileSync(fileLocation, "utf8");
    fileSystem.writeFileSync(fileLocation, content + utility.endOfLine + error.stack, function(err) {
       console.log(`Could not write log, reason: `);
       console.log(err); 
    });
}

module.exports = {logError};