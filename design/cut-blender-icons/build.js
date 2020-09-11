
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

    const isDark = theme === "dark";

    child_process.execSync(`rm -f icons/${theme}/*.png`);

    for (let row = 0; row < rows; row++) {

        for (let col = 0; col < cols; col++) {

            const name = names[col + "x" + row];

            if (name === "blank") {

                continue;
            }

            console.log(`Processing ${col}x${row}: ${name}`);

            const x = 10 + col * (size + 10);
            const y = 20 + row * (size + 10);

            const iconPath = `icons/${theme}/${name}.png`;

            child_process.execSync(`convert blender-${theme}-${size}.png -crop ${size}x${size}+${x}+${y} +repage ${iconPath}`)

            if (isDark) {

                html += `<div class="icon"><img src="${iconPath}"><br><br><label>${name}</label></div>\n`;
            }
        }

        if (isDark) {

            html += "<div style='clear:both'></div>";
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
