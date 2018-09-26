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
        //Last one is mustache
        let fileExtension = nameComponents[nameComponents.length - 2];

        var templateSource = fs.readFileSync(`${__dirname}/${templateLocation}`, "utf8");
        var template = handlebars.compile(templateSource);

        var extensionTransforms = config.transforms.filter(x=> x.split('.')[1] == fileExtension);
        if(extensionTransforms){
            extensionTransforms.forEach(function(transformPath){
                var modulePath = "." + transformPath.replace('\\', '/');
                var map = require(modulePath).map;
                config.data = transformer.transformData(config.data, map);
                //Add for each emmit
            });
        }

        //Add check for extension
        var templateData = {};
        var className = config.filename.split('.')[0];
        var filename = '';
        if(fileExtension === 'ts'){
            templateData = {data: config.data, className: utility.toTitleCase(className)};
            filename = `${utility.toTitleCase(className)}.${fileExtension}`;
        }
        else{
            templateData = config.data;
            filename = `${config.filename}`;
        }
        
        var result = {
            content: template(templateData),
            fileName: filename
        };

        rendered.push(result);
    });

    return rendered;
}

module.exports = { generateFiles };