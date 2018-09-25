const utility = require('./utility');
const fs = require('fs');
const mustache = require('mustache');

//Generate files from templates
generateFiles = (config) => {
    let rendered = [];
    
    config.templates.forEach(templateLocation => {
        let nameComponents = templateLocation.split(".");
        //Last one is mustache
        let fileExtension = nameComponents[nameComponents.length - 2];

        var template = fs.readFileSync(`${__dirname}/${templateLocation}`, "utf8");
        var result = {
            content: mustache.render(template, config.data),
            fileName: `${utility.toTitleCase(config.className)}.${fileExtension}`
        };

        rendered.push(result);
    });

    return rendered;
}

module.exports = {generateFiles};