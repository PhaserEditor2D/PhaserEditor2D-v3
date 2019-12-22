#!/usr/bin/node

const fs = require("fs");
const process = require("process")

const phaser_path = process.env.PHASER_PATH;
const phaser_json_path = phaser_path + "/phaser3-docs/json/phaser.json";

const content = fs.readFileSync(phaser_json_path);

const data = JSON.parse(content.toString());

const docsMap = {};

for(const item of data.docs) {
    
    docsMap[item.longname] = item.description;

    if (item.params) {
        
        for(const param of item.params) {
            docsMap[item.longname + "@" + param.name] = param.description;
        }
    }
}

const MEMBER_NAMES = [
    "Phaser.Loader.LoaderPlugin#spritesheet",
    "Phaser.Loader.LoaderPlugin#spritesheet@key"
];

const outputMap = {};

for(const name of MEMBER_NAMES) {
    outputMap[name] = docsMap[name];
}

const output = JSON.stringify(outputMap, null, 2);

fs.writeFileSync("../source/client/plugins/phasereditor2d.pack/phaser-docs.json", output);

console.log("done!");

