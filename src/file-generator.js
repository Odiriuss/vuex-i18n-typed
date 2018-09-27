const utility = require('./utility');
const transformer = require('./file-transformer');
const fs = require('fs');
const handlebars = require('handlebars');;

/**
 * File generator
 * @name generateFiles
 * @description generate files from templates
 * @param {config} config with template paths, class names
 * @return array - of {content: string, fileName: string}
 */
function generateFiles(config) {
    let rendered = [];

    config.templates.forEach(templateLocation => {
        let nameComponents = templateLocation.split(".");
        //Last one is handlebars
        let fileExtension = nameComponents[nameComponents.length - 2];
        var isClassTemplate = config.classes.includes(fileExtension);

        // if(config.lang !== config.filename.split('.')[1] && isClassTemplate){
        //     // break;
        // }

        var templateSource = fs.readFileSync(`${templateLocation}`, "utf8");
        var template = handlebars.compile(templateSource);

        var extensionTransforms = config.transforms.filter(x=> x.split('.')[1] == fileExtension);
        var emmitData = config.data;
        if(extensionTransforms){
            extensionTransforms.forEach(function(transformPath){
                var modulePath = "." + transformPath.replace('\\', '/');
                var map = require(modulePath).map;
                emmitData = transformer.transformData(config.data, map);
                //NOTE: Add for each emmit
            });
        }

        var templateData = {};
        var filename = '';
        if(isClassTemplate){
            var className = utility.toTitleCase(config.filename.split('.')[0]);
            templateData = {data: emmitData, className: className};
            filename = `${className}.${fileExtension}`;
        }
        else{
            templateData = emmitData;
            filename = `${config.filename}`;
        }

        var destination = config.extensionDestinations.find(x=> x.extension === fileExtension);
        var result = {
            content: template(templateData),
            folder: destination ? `${destination.path}` : `${config.destination}`,
            fullPath: destination ? `${destination.path}\\${filename}` : `${config.destination}\\${filename}`
        };

        rendered.push(result);
    });

    // console.log(rendered);
    return rendered;
}

module.exports = { generateFiles };