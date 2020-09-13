const fs = require("fs")

function getNames() {

    const data = {};

    const content = fs.readFileSync("UI_icons.h").toString();

    const lines = content.split("\n");

    const cols = 26;

    let row = 29;
    let col = 0;

    for (let line of lines) {

        if (line.startsWith("/*")) {

            continue;
        }

        {
            let index = line.indexOf("/");

            if (index >= 0) {

                line = line.substring(0, index - 1);
            }
        }

        line = line.trim();

        if (line === "") {

            continue;
        }

        let name = line.replace("DEF_ICON", "").replace("(", "").replace(")", "").toLowerCase();

        if (name.startsWith("_blank")) {

            name = "blank";
        }

        data[col + "x" + row] = name;

        //console.log(name);

        col++;

        if (col >= cols) {

            col = 0;
            row--;
        }
    }

    return data;
}

getNames();

module.exports = getNames;