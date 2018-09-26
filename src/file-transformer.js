const endOfLine = require('os').EOL;
const utility = require('./utility');
var dataTransform = require("node-json-transform").DataTransform;

//Transform file
transformFile = (fileContent, filename, tsLanguage) => {
    var jsonFileContent = {};
    var classConent = "";
    var lang = filename.split('.')[1];

    fileContent.forEach(function (element) {
        jsonFileContent[element.Key] = element.Value;
        var propertyComment = "\t" + `/** En translation: ${element.Value} */` + endOfLine;
        classConent += propertyComment + "\t" + `get ${element.Key}(): string {` + endOfLine 
            + "\t" + "\t" + "return Vue.i18n.translate(" + `'${element.Key}'` + ", Vue.i18n.locale());" + endOfLine + "\t" + "}" 
            + endOfLine;
    });

    var className = utility.toTitleCase(filename.split(".")[0]);
    var tsClass = "import { Vue } from 'vue-property-decorator';" + endOfLine + endOfLine
        + `export class ${className} {` + endOfLine + `${classConent}` + "}";
    
    let jsonContent = JSON.stringify(jsonFileContent, null, "\t");

    if(lang !== tsLanguage) tsClass = null;
    return {tsClass, jsonContent, filename, className};
}

function transformData(data, map){
    var dataObject = {};
    if(Array.isArray(data))
        dataObject = {translations:data};
    else
        dataObject = data;

    var transformer = dataTransform(dataObject, map);
    return transformer.transform();
}

module.exports = {transformFile, transformData};