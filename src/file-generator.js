const utility = require('./utility');
const transformer = require('./file-transformer');
const fs = require('fs');
const handlebars = require('handlebars');
var Q = require('q');


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
        let isClassTemplate = templateLocation.includes('class');

        if (config.lang !== config.filename.split('.')[1] && isClassTemplate) return;

        let templateSource = handleTemplateSource(fs.readFileSync(`${templateLocation}`, "utf8"));
        let template = handlebars.compile(templateSource.templateData);
        let emmitData = transformer.handleTransformations(config, fileExtension);

        let templateHandler = handleTemplate(config.filename, emmitData, isClassTemplate, fileExtension);
        let destination = templateSource.fileDestination ?
            templateHandler.fileDestination :
            config.extensionDestinations.find(x => x.extension === fileExtension);
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
 * Handles template source for destination path
 * @name handleTemplateSource
 * @description creates an object which sets the template data and file destination if any
 * @param {string} templateData - template data
 * @return pbject - {templateData: string, fileDestination: string}
 */
function handleTemplateSource(templateData){
    let fileDestination;
    let firstLine = templateData.split('\n')[0];
    if (firstLine.includes('Destination')){
        firstLine = firstLine.replace('/**','').replace('*/','').trim();
        fileDestination = firstLine.split(':')[1].trim();
        templateData = templateData.substring(templateData.indexOf("\n") + 1);
    }

    return {templateData, fileDestination};
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
        let nameComponents = destFilename.split('.');
        let finalName = destFilename;
        if(nameComponents[nameComponents.length - 1] !== fileExtension){
            finalName = "";
            for(let i = 0; i < nameComponents.length - 1; i++){
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