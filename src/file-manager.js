const fs = require('fs');

//Save files result
saveResult = (result, destFolder) => {
    if (!fs.existsSync(destFolder)) {
        fs.mkdirSync(destFolder);
    }
    
    if(result.jsonContent)
        saveFile(`${destFolder}/${result.filename}`, result.jsonContent);
    if(result.tsClass)
        saveFile(`${destFolder}/${result.className}.ts`, result.tsClass);
}

//Save single file
saveFile = (path, content) =>{
    fs.writeFileSync(path, content, function(err) {
        if(err) {
            return console.log(err);
        }
    }); 
}

saveGeneratedFiles = (config) =>{
    config.files.forEach(generatedFile => {
        fs.writeFileSync(`${config.destFolder}/${generatedFile.fileName}`, generatedFile.content, function(err) {
            if(err) {
                return console.log(err);
            }
        }); 
    });
}

module.exports = {saveResult, saveFile, saveGeneratedFiles};