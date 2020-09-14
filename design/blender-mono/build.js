
const getNames = require("./get-names");
const child_process = require("child_process");
const fs = require("fs");


const names = getNames();

// const cols = 5;
// const rows = 5;

const cols = 26;
const rows = 30;

const size = 32;

let html = "";

for (let theme of ["dark", "light"]) {

    child_process.execSync(`rm -f icons/${theme}/*.png`);

    for (let size of [16, 32]) {

        const genHTML = theme === "dark" && size === 32;

        for (let row = 0; row < rows; row++) {

            for (let col = 0; col < cols; col++) {

                let name = names[col + "x" + row];

                if (name === "blank") {

                    continue;
                }

                let f = size === 16 ? 1 : 2;

                if (f === 2) {
                    
                    name += "@2x";
                }

                console.log(`Processing ${col}x${row}: ${name}`);

                const x = 5 * f + col * (size + 5 * f);
                const y = 10 * f + row * (size + 5 * f);

                const iconPath = `icons/${theme}/${name}.png`;

                child_process.execSync(`convert blender-${theme}-${size}.png -crop ${size}x${size}+${x}+${y} +repage ${iconPath}`)

                if (genHTML) {

                    html += `<div class="icon"><img src="${iconPath}"><br><br><label>${name}</label></div>\n`;
                }
            }

            if (genHTML) {

                html += "<div style='clear:both'></div>";
            }
        }
    }
}

html = `

<html>

<style>

.icon {
    float:left;
    margin: 10px;
}

label {
    font-size: 12px;
}

body {
    background: #424242;
    color: lightGray;
}

</style>

<body>

<div>

${html}

</div>


</div>

</body>

</html>


`;



fs.writeFileSync("index.html", html);
