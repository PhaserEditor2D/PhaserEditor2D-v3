namespace phasereditor2d.scene.core.code {

    export class UnitCodeDOM {

        private _body: CodeDOM[];
        private _imports: ImportCodeDOM[];
        private _used: Set<string>;

        constructor(elements: CodeDOM[]) {

            this._body = elements;
            this._imports = [];
            this._used = new Set();
        }

        removeImports() {

            this._imports = [];
        }

        getImports() {

            return this._imports;
        }

        addImport(elementName: string, filePath: string) {

            const key = elementName + " form " + filePath;

            if (this._used.has(key)) {

                return;
            }

            this._used.add(key);
            this._imports.push(new ImportCodeDOM(elementName, filePath));
        }

        getBody() {

            return this._body;
        }

        setBody(body: CodeDOM[]) {

            this._body = body;
        }
    }
}