let fs = require('fs');

let configPath = './config.json';

let parsed = JSON.parse(fs.readFileSync(configPath, 'UTF-8'));
exports.dbConfig = parsed;