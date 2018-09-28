var dataTransform = require("node-json-transform").DataTransform;

/**
 * Data transformer
 * @name transformData
 * @description transform data with the given map
 * @param {Object} data - json data that will be used in the transformations
 * @param {Object} map - map object that will be passed to the data transform function 
 * @return {string} - transformed data
 */
function transformData(data, map) {
    let dataObject = {};

    if (Array.isArray(data)) dataObject = {
        translations: data
    };
    else dataObject = data;

    return dataTransform(dataObject, map).transform();
}

/**
 * Tranformation handler
 * @name handleTransformations
 * @description loops thorugh all the transformations and creates transforms based on that
 * @param {Object} config - 
 *          {Object} data - data to be transformed 
 *          {Array of string} transforms - transform script locations
 * @param {string} fileExtension - which extensions to use in transforms 
 * @return {string} - transformed data
 */
function handleTransformations(config, fileExtension) {
    let emmitData = config.data;

    if (config.transforms) {
        let extensionTransforms = config.transforms.filter(x => x.split('.')[1] == fileExtension);
        if (extensionTransforms) {
            extensionTransforms.forEach(function (transformPath) {
                let modulePath = "." + transformPath.replace('\\', '/');
                let map = require(modulePath).map;
                emmitData = transformData(config.data, map);
                //NOTE: Add for each emmit
            });
        }
    }

    return emmitData;
}

module.exports = {
    transformData,
    handleTransformations
};