const fs = require('fs');
const ft = require('./file-transformer');
const fm = require('./file-manager');

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

          let result = ft.transformFile(JSON.parse(content), filename, config.lang);
          fm.saveResult(result, config.destination);
          
          console.log(filename);
        });
      });
    });
  }

module.exports = {emmitFiles};