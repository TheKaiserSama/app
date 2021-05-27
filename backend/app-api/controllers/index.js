const fs = require('fs');
const path = require('path');
const basename = path.basename(__filename);

const Controllers = {};

fs.
readdirSync(path.join(__dirname)).
filter(file => {
    return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
}).
forEach(file => {
    Controllers[file.slice(0, file.length - 3)] = require(path.join(__dirname, file));
});

module.exports = Controllers;