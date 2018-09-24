var fm = require('./file-manager');
var ft = require('./file-transformer');
const fs = require('fs');
const md5 = require('md5');

let md5Cache = {};
let fsWait = false;

//Build initial cache
buildCache = (watchFolder) => {
    fs.readdir(watchFolder, (err, files) => {
        files.forEach(filename => {
            var file = fs.readFileSync(`${watchFolder}/${filename}`, "utf8");
            const fileMd5 = md5(file);
            md5Cache[filename] = fileMd5;
        });
    });
}

//Watch for file changes
watchFiles = (watchFolder, destFolder, lang) => {
    fs.watch(watchFolder, (event, filename) => {
        if (filename) {
            if (fsWait) return;
            fsWait = setTimeout(() => {
                fsWait = false;
            }, 100);

            var file = fs.readFileSync(`${watchFolder}/${filename}`, "utf8");
            const fileMd5 = md5(file);
            if (fileMd5 === md5Cache[filename]) {
                return;
            }
            md5Cache[filename] = fileMd5;
            console.log(`${filename} file Changed`);
    
            let result = ft.transformFile(JSON.parse(file), filename, lang);
            fm.saveResult(result, destFolder);
        }
    });
}

module.exports = {buildCache, watchFiles};