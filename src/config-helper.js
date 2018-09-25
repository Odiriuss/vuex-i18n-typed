const watcher = require('./watcher');
const emmiter = require('./emitter');
const fs = require('fs');
const yargs = require('yargs');

startWatching = (config) => {
    resolveOperation(config, watcher.initWatcher);
}

startEmit = (config) => {
    resolveOperation(config, emmiter.emmitFiles);
}

resolveOperation = (config, func) =>{
    console.log(config);
    probaTemplate(config);
    // config.source = __dirname + config.source;
    // config.destination = __dirname + config.destination;

    // if(!fs.existsSync(config.source)){
    //     console.log("Source folder doesn't exist!");
    //     yargs.showHelp();
    // }
    // else{
    //     func(config);
    // }
}

probaTemplate = (config) =>{

}

module.exports = {startWatching, startEmit};