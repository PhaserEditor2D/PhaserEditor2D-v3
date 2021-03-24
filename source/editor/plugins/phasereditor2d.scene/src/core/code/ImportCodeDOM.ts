namespace phasereditor2d.scene.core.code {

    export class ImportCodeDOM extends CodeDOM {
        private _elementName: string;
        private _filePath: string;

        constructor(elementName: string, filePath: string) {
            super();

            this._elementName = elementName;
            this._filePath = filePath;
        }

        getElementName() {

            return this._elementName;
        }

        getFilePath() {

            return this._filePath;
        }
    }
}