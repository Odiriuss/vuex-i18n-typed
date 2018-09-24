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

initWatcher = (config) =>{
    watcher.buildCache(config);
    watcher.watchFiles(config);
}

resolveOperation = (args, func) =>{
    args.source = __dirname + args.source;
    args.destination = __dirname + args.destination;

    if(!fs.existsSync(args.source)){
        console.log("Source folder doesn't exist!");
        yargs.showHelp();
    }
    else{
        func(args);
    }
}

module.exports = {startWatching, createEmit};