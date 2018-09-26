const fs = require('fs');
const fm = require('./file-manager');
const fileGenerator = require('./file-generator');

emmitFiles = (config) => {
    fs.readdir(config.source, function(err, filenames) {
      if (err) {
        // config.onError(err);
        return;
      }
      filenames.forEach(function(filename) {
        fs.readFile(`${config.source}/${filename}`, 'utf-8', function(err, content) {
          if (err) {
            // config.onError(err);
            return;
          }

          var generateConfig = {
            source: config.source,
            templates: config.templates,
            transforms: config.transforms,
            data: JSON.parse(content),
            filename: filename
          };

          let result = fileGenerator.generateFiles(generateConfig);
          fm.saveGeneratedFiles({files: result, destFolder: config.destination});
          
          console.log(filename);
        });
      });
    });
  }

module.exports = {emmitFiles};