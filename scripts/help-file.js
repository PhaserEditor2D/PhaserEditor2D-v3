
const fs = require("fs");
const process = require("process")


const phaser_path = process.env.PHASER_PATH;
const phaser_json_path = phaser_path + "/phaser3-docs/json/phaser.json";
const spine_json_path = phaser_path + "/spine-phaser-docs/out.json";

const docsMap = {};

for (const inputJsonFile of [phaser_json_path, spine_json_path]) {

    const content = fs.readFileSync(inputJsonFile);

    const data = JSON.parse(content.toString());

    for (const item of data.docs) {

        let longname = item.longname.replace("#", ".");

        if (item.meta && item.meta.path
            && (item.meta.path.endsWith("spine-phaser-docs/spine-core/dist")
                || item.meta.path.endsWith("spine-phaser-docs/spine-phaser/dist"))) {

            longname = "spine." + longname;
        }

        docsMap[longname] = item.description || item.classdesc;

        if (item.params) {

            for (const param of item.params) {

                docsMap[longname + "(" + param.name + ")"] = param.description;
            }

        } else if (item.properties) {

            for (const prop of item.properties) {

                docsMap[longname + "." + prop.name] = prop.description;
            }
        }
    }
}

function makeHelpFile(members, outputPath, source) {

    console.log(outputPath + ":")

    const outputMap = {};

    for (const name of members) {

        const docs = docsMap[name];

        if (docs) {

            outputMap[name] = docs;

            console.log(name + " -> " + docs.substring(0, Math.min(docs.length, 80)).split("\n").join(" ") + "...")

        } else {
            console.log("Cannot find name " + name);
            throw new Error("Cannot find name: " + name);
        }
    }

    const output = JSON.stringify(outputMap, null, 2);

    console.log("---");

    fs.writeFileSync(outputPath, output);
}


module.exports = {
    makeHelpFile: makeHelpFile
}