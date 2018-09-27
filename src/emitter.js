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

          config.filename = filename;
          config.data = JSON.parse(content);

          let result = fileGenerator.generateFiles(config);
          fm.saveGeneratedFiles({files: result, destFolder: config.destination});
          
          console.log(filename);
        });
      });
    });
}

module.exports = {emmitFiles};