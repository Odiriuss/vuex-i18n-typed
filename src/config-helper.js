const watcher = require('./watcher');
const emmiter = require('./emitter');
const fs = require('fs');
const yargs = require('yargs');

function startWatching (config) {
    resolveOperation(config, watcher.initWatcher);
}

function startEmit(config) {
    resolveOperation(config, emmiter.emmitFiles);
}

function resolveOperation(config, func) {
    config.source = __dirname + config.source;
    config.destination = __dirname + config.destination;
    config.transforms = prepareFiles(config.transforms, true);
    config.templates = prepareFiles(config.templates);
    config.extensionDestinations = prepareDestinations(config.extensionDestinations);

    if (!fs.existsSync(config.source)) {
        showHelp("Source folder doesn't exist!");
    } else {
        func(config);
    }
}

function prepareDestinations(extensionDestinations){
    var result = [];
    if(extensionDestinations && Array.isArray(extensionDestinations)){
        extensionDestinations.forEach((extensionDestination)=>{
            var extension = extensionDestination.split('=')[0];
            var path = __dirname + extensionDestination.split('=')[1];
            result.push({extension, path});
        });
    }

    return result;
}

function prepareFiles(fileFolder, isTransforms = false) {
    var result = [];
    
    if (fileFolder) {
        var filenames = fs.readdirSync(`${__dirname}\\${fileFolder}`);
        filenames.forEach(function (filename) {
            result.push(isTransforms === true ? 
                `${fileFolder}\\${filename}`:
                `${__dirname}${fileFolder}\\${filename}`);
        });
    }
    
    return result;
}

function showHelp(message){
    console.log(message);
    yargs.showHelp();
}

module.exports = {
    startWatching,
    startEmit
};