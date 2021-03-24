namespace phasereditor2d.scene.core.code {

    export class ImportCodeDOM extends CodeDOM {
        private _elements: string[];
        private _filePath: string;

        constructor(elementName: string, filePath: string) {
            super();

            this._elements = [elementName];
            this._filePath = filePath;
        }

        getElements() {

            return this._elements;
        }

        getFilePath() {

            return this._filePath;
        }
    }
}