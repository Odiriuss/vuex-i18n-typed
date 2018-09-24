const watcher = require('./watcher');
const emmiter = require('./emitter');
const fs = require('fs');
const yargs = require('yargs');

startWatching = (args) => {
    resolveOperation(args, initWatcher);
}

createEmit = (args) => {
    resolveOperation(args, emmiter.emmitFiles);
}

initWatcher = (sourceFolder, destFolder, lang) =>{
    watcher.buildCache(sourceFolder);
    watcher.watchFiles(sourceFolder, destFolder, lang);
}

resolveOperation = (args, func) =>{
    let sourceFolder = __dirname + args.source;
    let destFolder = __dirname + args.destination;

    if(!fs.existsSync(sourceFolder)){
        console.log("Source folder doesn't exist!");
        yargs.showHelp();
    }
    else{
        func(sourceFolder, destFolder, args.lang);
    }
}

module.exports = {startWatching, createEmit};