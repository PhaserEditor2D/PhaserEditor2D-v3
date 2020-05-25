namespace colibri.ui.controls {

    export class Colors {

        static parseColor(htmlColor: string) {

            if (htmlColor.startsWith("0x")) {

                htmlColor = "#" + htmlColor.substring(2);
            }

            const vanillaColor = window["VanillaColor"];

            const rgba = new vanillaColor(htmlColor).rgba;

            return {
                r: rgba[0],
                g: rgba[1],
                b: rgba[2],
                a: rgba[3],
            }
        }
    }
}