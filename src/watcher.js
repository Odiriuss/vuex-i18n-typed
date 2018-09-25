const fm = require('./file-manager');
const ft = require('./file-transformer');
const fs = require('fs');
const md5 = require('md5');

let md5Cache = {};
let fsWait = false;

initWatcher = (config) =>{
    buildCache(config);
    watchFiles(config);
}

//Build initial cache
buildCache = (config) => {
    fs.readdir(config.source, (err, files) => {
        files.forEach(filename => {
            var file = fs.readFileSync(`${config.source}/${filename}`, "utf8");
            const fileMd5 = md5(file);
            md5Cache[filename] = fileMd5;
        });
    });
}

//Watch for file changes
watchFiles = (config) => {
    fs.watch(config.source, (event, filename) => {
        if (filename) {
            if (fsWait) return;
            fsWait = setTimeout(() => {
                fsWait = false;
            }, 100);

            var file = fs.readFileSync(`${config.source}/${filename}`, "utf8");
            const fileMd5 = md5(file);
            if (fileMd5 === md5Cache[filename]) {
                return;
            }
            md5Cache[filename] = fileMd5;
            console.log(`${filename} file Changed`);
    
            let result = ft.transformFile(JSON.parse(file), filename, config.lang);
            fm.saveResult(result, config.destination);
        }
    });
}

module.exports = {initWatcher, buildCache, watchFiles};