namespace phasereditor2d.scene.core.code {

    export class ImportCodeDOM extends CodeDOM {
        private _elementName: string;
        private _filePath: string;
        private _asDefault: boolean;

        constructor(elementName: string, filePath: string, asDefault: boolean) {
            super();

            this._elementName = elementName;
            this._filePath = filePath;
            this._asDefault = asDefault;
        }

        getElementName() {

            return this._elementName;
        }

        getFilePath() {

            return this._filePath;
        }

        isAsDefault() {

            return this._asDefault;
        }
    }
}