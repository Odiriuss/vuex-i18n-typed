const utility = require('./utility');
const transformer = require('./file-transformer');
const fs = require('fs');
const handlebars = require('handlebars');;

/**
 * File generator
 * @name generateFiles
 * @description generate files from templates nad apply transforms if any
 * @param {Object} config 
 *      Elements: {Array of strings} transforms
 *                 {Array of strings} templates
 *                 {Array of strings} classes
 * @return array - of {content: string, fileName: string}
 */
function generateFiles(config) {
    let rendered = [];

    config.templates.forEach(templateLocation => {
        let nameComponents = templateLocation.split(".");
        //Last one is handlebars
        let fileExtension = nameComponents[nameComponents.length - 2];
        let isClassTemplate = config.classes && config.classes.includes(fileExtension);

        if (config.lang !== config.filename.split('.')[1] && isClassTemplate) return;

        let templateSource = fs.readFileSync(`${templateLocation}`, "utf8");
        let template = handlebars.compile(templateSource);
        let emmitData = transformer.handleTransformations(config, fileExtension);

        let templateHandler = handleTemplate(config.filename, emmitData, isClassTemplate, fileExtension);
        let destination = config.extensionDestinations.find(x => x.extension === fileExtension);
        let result = {
            content: template(templateHandler.templateData),
            fileName: templateHandler.filename,
            folder: destination ? destination.path : config.destination,
            fullPath: destination ? `${destination.path}\\${templateHandler.filename}` 
                : `${config.destination}\\${templateHandler.filename}`
        };

        rendered.push(result);
    });

    return rendered;
}

/**
 * Handles template name and content assignment
 * @name handleTemplate
 * @description creates an object which sets the template data and filename
 * @param {string} destFilename - destination file name 
 * @param {Object} emmitData - data to be emmited
 * @param {bool} isClassTemplate - is the template a class template 
 * @param {string} fileExtension - file extension
 * @return array - of {content: string, fileName: string}
 */
function handleTemplate(destFilename, emmitData, isClassTemplate, fileExtension) {
    let templateData = {};
    let filename = '';
    if (isClassTemplate) {
        let className = utility.toTitleCase(destFilename.split('.')[0]);
        templateData = {
            data: emmitData,
            className: className
        };
        filename = `${className}.${fileExtension}`;
    } else {
        let finalName = destFilename.includes(fileExtension) ?
            destFilename : undefined;
        if(!finalName){
            let nameComponents = destFilename.split('.');
            for(let i = 0; i < nameComponents.length - 2; i++){
                finalName += `${nameComponents[i]}.`;
            }

            finalName += fileExtension;
        }
        
        templateData = emmitData;
        filename = finalName;
    }

    return {templateData, filename};
}

module.exports = {
    generateFiles
};