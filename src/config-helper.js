const watcher = require('./watcher');
const emmiter = require('./emitter');
const fs = require('fs');
const Mustache = require('mustache');
const yargs = require('yargs');

startWatching = (config) => {
    resolveOperation(config, watcher.initWatcher);
}

startEmit = (config) => {
    resolveOperation(config, emmiter.emmitFiles);
}

resolveOperation = (config, func) =>{
    config.source = __dirname + config.source;
    config.destination = __dirname + config.destination;

    if(!fs.existsSync(config.source)){
        console.log("Source folder doesn't exist!");
        yargs.showHelp();
    }
    else{
        func(config);
    }
}

// probaTemplate = (config) =>{
//     var template = fs.readFileSync(`${__dirname}/templates/proba.mustache`, "utf8");
//     var data = {
//         className: "General",
//         values: [
//             {
//                 "Key": "_30days",
//                 "Value": "30 days de 1",
//                 "LastModifiedUtcTime": "2018-03-27T06:36:51.4913332Z",
//                 "Comment": ""
//             },
//             {
//                 "Key": "_7days",
//                 "Value": "7 days de 4",
//                 "LastModifiedUtcTime": "2018-03-27T06:36:51.4913332Z",
//                 "Comment": "1234"
//             }
//         ]
//     };
//     var rendered = Mustache.render(template, data);
//     console.log(rendered);
// }

module.exports = {startWatching, startEmit};