namespace phasereditor2d.scene.core.code {

    export function isAlphaNumeric(c: string) {

        const n = c.charCodeAt(0);

        return (n > 47 && n < 58) // 0-9
            || (n > 64 && n < 91) // a-z
            || (n > 96 && n < 123); // A-Z
    }

    export function formatToValidVarName(name: string) {

        let s = "";

        for (const c of name) {

            if (isAlphaNumeric(c)) {

                s += (s.length === 0 ? c.toLowerCase() : c);

            } else {

                s += "_";
            }
        }

        return s;
    }
}