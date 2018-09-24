const fs = require('fs');
const ft = require('./file-transformer');
const fm = require('./file-manager');

emmitFiles = (dirname, destFolder, onError, tsLang = 'en') => {
    fs.readdir(dirname, function(err, filenames) {
      if (err) {
        // onError(err);
        return;
      }
      filenames.forEach(function(filename) {
        fs.readFile(`${dirname}/${filename}`, 'utf-8', function(err, content) {
          if (err) {
            // onError(err);
            return;
          }

          let result = ft.transformFile(JSON.parse(content), filename, tsLang);
          fm.saveResult(result, destFolder);
          
          console.log(filename);
        });
      });
    });
  }

module.exports = {emmitFiles};