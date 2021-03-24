namespace phasereditor2d.scene.core.code {

    import io = colibri.core.io;

    export function getImportPath(file: io.FilePath, importFile: io.FilePath): string {

        const parent = file.getParent();
        const parentPath = parent.getFullName();
        const parentElements = parentPath.split("/");
        const importFilePath = importFile.getParent().getFullName() + "/" + importFile.getNameWithoutExtension();
        const importFileElements = importFilePath.split("/");

        if (parent === importFile.getParent()) {

            return "./" + importFile.getNameWithoutExtension();
        }

        if (importFilePath.startsWith(parentPath)) {

            return "./" + importFileElements.slice(parentElements.length).join("/");
        }

        while(parentElements.length > 0) {

            const parentFirst = parentElements.shift();
            const importFileFirst = importFileElements.shift();

            if (parentFirst !== importFileFirst) {

                importFileElements.unshift(importFileFirst);

                return "../".repeat(parentElements.length + 1) + importFileElements.join("/");
            }
        }

        return "";
    }

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