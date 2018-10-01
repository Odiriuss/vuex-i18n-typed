const fileSystem = require('fs');
const md5 = require('md5');
const errorHandler = require('./error-handler');
const fileGenerator = require('./file-generator');
const fileManager = require('./file-manager');

/**
 * @name md5Cache
 * @description Cache being used by the watcher
 * @type {Object}
 */
let md5Cache = {};

/**
 * @name fsWait
 * @description Boolean that indicates to wait or not for source changes
 * @type {string}
 */
let fsWait = false;

/**
 * Initializes the watcher
 * @name initWatcher
 * @description Builds the cache and starts the watcher
 * @param {Object} config - config passed from yargs
 */
function initWatcher(config) {
    buildCache(config);
    watchFiles(config);
}

/**
 * Cache builder
 * @name buildCache
 * @description builds the initial cache for the watcher
 * @param {Object} config - config passed from yargs
 */
function buildCache(config) {
    fileSystem.readdir(config.source, (err, files) => {
        files.forEach(filename => {
            let content = fileSystem.readFileSync(`${config.source}/${filename}`, "utf8");
            const fileMd5 = md5(content);
            md5Cache[filename] = fileMd5;
        });
    });
}

/**
 * Watches source folder and emmits when a change happens 
 * @name watchFiles
 * @description emmits templates for all files in given directory with given templates whenever a file
 * in the source directory changes
 * @param {Object} config - config passed from yargs
 */
function watchFiles(config) {
    fileSystem.watch(config.source, (event, filename) => {
        if (filename) {
            if (fsWait) return;
            fsWait = setTimeout(() => {
                fsWait = false;
            }, 100);

            let content = fileSystem.readFileSync(`${config.source}/${filename}`, "utf8");
            const fileMd5 = md5(content);
            if (fileMd5 === md5Cache[filename]) return;

            md5Cache[filename] = fileMd5;
            console.log(`File changed: ${filename}!`);

            try {
                config.filename = filename;
                config.data = JSON.parse(content);

                let result = fileGenerator.generateFiles(config);
                fileManager.saveGeneratedFiles(result);
                fileManager.displaySavedFiles(result, filename);
            } catch (error) {
                errorHandler.handleError(error);
            }
        }
    });
}

module.exports = {
    initWatcher,
    buildCache,
    watchFiles
};