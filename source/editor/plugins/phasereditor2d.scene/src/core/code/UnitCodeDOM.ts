namespace phasereditor2d.scene.core.code {

    export class UnitCodeDOM {

        private _body: CodeDOM[];
        private _typeScriptInterfaces: InterfaceDeclCodeDOM[];
        private _imports: ImportCodeDOM[];
        private _used: Set<string>;

        constructor(elements: CodeDOM[]) {

            this._body = elements;
            this._typeScriptInterfaces = [];
            this._imports = [];
            this._used = new Set();
        }

        getTypeScriptInterfaces() {

            return this._typeScriptInterfaces;
        }

        getImports() {

            return this._imports;
        }

        addImport(elementName: string, filePath: string, asDefault: boolean) {

            const key = (asDefault ? elementName : `{ ${elementName} }`) + " form " + filePath;

            if (this._used.has(key)) {

                return;
            }

            this._used.add(key);
            this._imports.push(new ImportCodeDOM(elementName, filePath, asDefault));
        }

        getBody() {

            return this._body;
        }

        setBody(body: CodeDOM[]) {

            this._body = body;
        }
    }
}