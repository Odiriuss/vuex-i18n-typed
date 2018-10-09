const fileSystem = require('fs');
const fileManager = require('./file-manager');
const fileGenerator = require('./file-generator');
const errorHandler = require('./error-handler');

/**
 * Emmits file templates 
 * @name emmitFiles
 * @description emmits templates for all files in given directory with given templates
 * @param {Object} config - config passed from yargs
 */
function emmitFiles(config) {
  fileSystem.readdir(config.source, function (err, filenames) {
    if (err) {
      errorHandler.handleError(err);
      return;
    }
    filenames.forEach(function (filename) {
      fileSystem.readFile(`${config.source}/${filename}`, 'utf-8', function (err, content) {
        if (err) {
          errorHandler.handleError(err);
          return;
        }

        try {
          config.filename = filename;

          if (config.cleaner)
            config.data = fileGenerator.handleSourceCleanup(content, config.cleaner, `${config.source}/${filename}`);
          else
            config.data = JSON.parse(content);

          let result = fileGenerator.generateFiles(config);
          fileManager.saveGeneratedFiles(result);
          fileManager.displaySavedFiles(result, filename);
        } catch (error) {
          errorHandler.handleError(error);
        }
      });
    });
  });
}

module.exports = {
  emmitFiles
};