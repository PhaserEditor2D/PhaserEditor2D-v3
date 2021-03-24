namespace phasereditor2d.scene.core.code {

    export class UnitCodeDOM {

        private _body: CodeDOM[];
        private _imports: ImportCodeDOM[];

        constructor(elements: CodeDOM[]) {

            this._body = elements;
            this._imports = [];
        }

        removeImports() {

            this._imports = [];
        }

        getImports() {

            return this._imports;
        }

        addImport(elementName: string, filePath: string, brackets: boolean) {

            const importDom = this._imports.find(i => i.getFilePath() === filePath);

            if (importDom) {

                if (importDom.getElements().indexOf(elementName) < 0) {

                    importDom.getElements().push(elementName);
                }

            } else {

                this._imports.push(new ImportCodeDOM(elementName, filePath, brackets))
            }
        }

        getBody() {

            return this._body;
        }

        setBody(body: CodeDOM[]) {

            this._body = body;
        }
    }
}