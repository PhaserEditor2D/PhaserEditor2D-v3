
const fs = require("fs");
const process = require("process")

const phaser_path = process.env.PHASER_PATH;
const phaser_json_path = phaser_path + "/phaser3-docs/json/phaser.json";

const content = fs.readFileSync(phaser_json_path);

const data = JSON.parse(content.toString());

const docsMap = {};

let i = 1;

for (const item of data.docs) {

    if (item.kind !== "event") {

        continue;
    }

    let { name, memberof } = item;

    const fullName = `${memberof}.${name}`;

    docsMap[fullName] = item.description || item.classdesc;

    console.log(`${i++} Processing event fullName`);
}

const output = JSON.stringify(docsMap, null, 2);

console.log("---");
console.log("Writing to file events.json...");

fs.writeFileSync("../source/editor/plugins/phasereditor2d.resources/_res/phasereditor2d.scene/docs/events.json", output);

console.log("Done.");