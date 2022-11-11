const yaml          = require('js-yaml');
const fs            = require('fs');
var constant        = {};

try {
    let env_file = "development.env.yml";

    let fileContents = fs.readFileSync(__dirname+'/'+env_file, 'utf8');
    let data = yaml.load(fileContents);

    for(let key in data){
        constant[key] = data[key];
    }

} catch(err) {
    console.log('Error loading yml file', err);
    process.exit(1);
}

module.exports = constant;