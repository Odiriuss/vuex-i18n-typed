const endOfLine = require('os').EOL;

//Transform file
transformFile = (fileContent, filename, tsLanguage = 'en') => {
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

    var className = fileNameToTitleCase(filename.split(".")[0]);
    var tsClass = "import { Vue } from 'vue-property-decorator';" + endOfLine + endOfLine
        + `export class ${className} {` + endOfLine + `${classConent}` + "}";
    
    let jsonContent = JSON.stringify(jsonFileContent, null, "\t");

    if(lang !== tsLanguage) tsClass = null;
    return {tsClass, jsonContent, filename, className};
}

//First letter to uppercase
fileNameToTitleCase = (str) => {
    return str.replace(/\w\S*/g, function(txt){
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
}

module.exports = {transformFile, fileNameToTitleCase};