const Directory = require('overdrive').IO.Directory;
const path = require('path');

function findModels(){
    let models = {};
    for (const file of Directory.getFiles(path.join(__dirname, 'models')))
    {
        const model = require(file);
        models[model.name] = model;
    }
    return models;
}

exports.Models = findModels();

exports.Seeds = [
    require('./seeds/user_seeds'),
    require('./seeds/item_seeds')
];