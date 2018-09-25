const fs = require('fs');
const ft = require('./file-transformer');
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

          // let result = ft.transformFile(JSON.parse(content), filename, config.lang);
          
          var generateConfig = {
            source: config.source,
            templates: config.templates,
            data: {values: JSON.parse(content)},
            className: filename.split('.')[0]
          };

          let result = fileGenerator.generateFiles(generateConfig);
          fm.saveGeneratedFiles({files: result, destFolder: config.destination});
          
          console.log(filename);
        });
      });
    });
  }

module.exports = {emmitFiles};