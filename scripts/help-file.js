
const fs = require("fs");
const process = require("process")


const phaser_path = process.env.PHASER_PATH;
const phaser_json_path = phaser_path + "/phaser3-docs/json/phaser.json";

const content = fs.readFileSync(phaser_json_path);

const data = JSON.parse(content.toString());

const docsMap = {};

for(const item of data.docs) {

    const longname = item.longname.replace("#", ".");
    
    docsMap[longname] = item.description;

    if (item.params) {
        
        for(const param of item.params) {
            docsMap[longname + "(" + param.name + ")"] = param.description;
        }

    } else if (item.properties) {

        for(const prop of item.properties) {

            docsMap[longname + "." + prop.name] = prop.description;
        }
    }
}

function makeHelpFile(members, outputPath) {

    const outputMap = {};

    for(const name of members) {
        
        if (name in docsMap) {
            outputMap[name] = docsMap[name];
        } else {
        	console.log("Cannot find name " + name);
            throw new Error("Cannot find name: " + name);
        }
    }
    
    const output = JSON.stringify(outputMap, null, 2);
    
    console.log(outputPath + ":")
    console.log(output);
    console.log("---");

    fs.writeFileSync(outputPath, output);
}


module.exports = {
    makeHelpFile: makeHelpFile
}