const watcher = require('./watcher');
const emmiter = require('./emitter');
const utility = require('./utility');
const errorHandler = require('./error-handler');
const fileSystem = require('fs');

/**
 * Start the watch command 
 * @name startWatching
 * @description starts the watch command
 * @param {Object} config - config passed from yargs
 */
function startWatching(config) {
    resolveOperation(config, watcher.initWatcher);
    console.log(`Watching folder: ${config.source}`);
}

/**
 * Start the emmit command 
 * @name startEmit
 * @description starts the emmit command
 * @param {Object} config - config passed from yargs
 */
function startEmit(config) {
    resolveOperation(config, emmiter.emmitFiles);
    console.log(`Emitting files from folder: ${config.source}`);
}

/**
 * Resolve the operation to be run and pass the data to it
 * @name resolveOperation
 * @description starts the appropriate command and sets up the initial data
 * @param {Object} config - config passed from yargs
 * @param {Function} func - function to be executed with the prepared data
 */
function resolveOperation(config, func) {
    config.source = __dirname + config.source;

    if (!fileSystem.existsSync(config.source)) {
        utility.showHelp("Source folder doesn't exist!");
    } else {
        config.destination = __dirname + config.destination;
        config.log = __dirname + config.log;

        try {
            config.transforms = prepareFiles(config.transforms, true);
            config.templates = prepareFiles(config.templates);
            config.extensionDestinations = prepareDestinations(config.extensionDestinations);
        } catch (err) {
            errorHandler.handleError(err);
            utility.showHelp("Error preparing files!");
        }

        func(config);
    }
}

/**
 * Prepare destination paths
 * @name prepareDestinations
 * @description prepares the destination paths from the initial yargs config
 * @param {Array of strings} extensionDestinations - paths from yargs
 */
function prepareDestinations(extensionDestinations) {
    let result = [];

    if (extensionDestinations && Array.isArray(extensionDestinations)) {
        extensionDestinations.forEach((extensionDestination) => {
            let extension = extensionDestination.split('=')[0];
            let path = __dirname + extensionDestination.split('=')[1];
            result.push({
                extension,
                path
            });
        });
    }

    return result;
}

/**
 * Prepare file paths
 * @name prepareFiles
 * @description prepares file paths from the given folder
 * @param {string} fileFolder - folder path from yargs
 */
function prepareFiles(fileFolder, isTransforms = false) {
    let result = [];

    if (fileFolder) {
        let filenames = fileSystem.readdirSync(`${__dirname}\\${fileFolder}`);
        filenames.forEach(function (filename) {
            result.push(isTransforms === true ?
                `${fileFolder}\\${filename}` :
                `${__dirname}${fileFolder}\\${filename}`);
        });
    }

    return result;
}

module.exports = {
    startWatching,
    startEmit
};