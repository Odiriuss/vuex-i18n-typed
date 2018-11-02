const utility = require('./utility');
const transformer = require('./file-transformer');
const fs = require('fs');
const handlebars = require('handlebars');

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
    
    handlebars.registerHelper('encodeMyString',function(inputData){
        if(inputData)
            inputData = inputData.toString().replace('\"","\'');
            
        return new handlebars.SafeString(inputData);
    });

    config.templates.forEach(templateLocation => {
        let isClassTemplate = templateLocation.includes('class');
        let filenameParts = config.filename.split('.');
        if (config.lang !== filenameParts[filenameParts.length - 2] && isClassTemplate) return;

        let nameComponents = templateLocation.split(".");
        let fileExtension = nameComponents[nameComponents.length - 2];

        let templateSource = handleTemplateSource(fs.readFileSync(`${templateLocation}`, "utf8"));
        let template = handlebars.compile(templateSource.sourceData);
        let emmitData = transformer.handleTransformations(config, fileExtension);
        fileExtension = templateSource.fileExtension ?
            templateSource.fileExtension :
            //Last one is handlebars
            nameComponents[nameComponents.length - 2];

        let templateHandler = handleTemplate(config.filename, emmitData, isClassTemplate, fileExtension);
        let destination = templateSource.fileDestination ? {
                path: __dirname + templateSource.fileDestination
            } :
            config.extensionDestinations.find(x => x.extension === fileExtension);
        let result = {
            content: template(templateHandler.templateData),
            fileName: templateHandler.filename,
            folder: destination ? destination.path : config.destination,
            fullPath: destination ? `${destination.path}\\${templateHandler.filename}` : `${config.destination}\\${templateHandler.filename}`
        };

        rendered.push(result);
    });

    return rendered;
}

/**
 * Handles template source for destination path
 * @name handleTemplateSource
 * @description creates an object which sets the template data and file destination if any
 * @param {string} sourceData - source template data
 * @return pbject - {templateData: string, fileDestination: string}
 */
function handleTemplateSource(sourceData) {
    let fileDestination;
    let fileExtension;

    let firstLine = sourceData.split('\n')[0];
    if (firstLine.includes('destination') || firstLine.includes('extension')) {
        firstLine = firstLine.replace('/**', '').replace('*/', '').trim();

        let templateOptions = JSON.parse(firstLine);
        fileDestination = templateOptions.destination;
        fileExtension = templateOptions.extension;
        sourceData = sourceData.substring(sourceData.indexOf("\n") + 1);
    }

    return {
        sourceData,
        fileDestination,
        fileExtension
    };
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
        if (nameComponents[nameComponents.length - 1] !== fileExtension) {
            finalName = "";
            for (let i = 0; i < nameComponents.length - 1; i++) {
                finalName += `${nameComponents[i]}.`;
            }

            finalName += fileExtension;
        }

        templateData = emmitData;
        filename = finalName;
    }

    return {
        templateData,
        filename
    };
}

/**
 * Source cleanup handler
 * @name handleSourceCleanup
 * @description takes the cleanSource function from the module and applies it to the source data
 * @return {string} - transformed data
 */
function handleSourceCleanup(content, path, destPath) {
    let modulePath = "." + path.replace('\\', '/');
    let clean = require(modulePath).cleanSource;

    return clean(content, destPath);
}

module.exports = {
    generateFiles,
    handleSourceCleanup
};