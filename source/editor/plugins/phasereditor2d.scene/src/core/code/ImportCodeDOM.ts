namespace phasereditor2d.scene.core.code {

    export class ImportCodeDOM extends CodeDOM {
        private _elements: string[];
        private _filePath: string;
        private _brackets: boolean;

        constructor(elementName: string, filePath: string, brackets: boolean) {
            super();

            this._elements = [elementName];
            this._filePath = filePath;
            this._brackets = brackets;
        }

        isBrackets() {

            return this._brackets;
        }

        getElements() {

            return this._elements;
        }

        getFilePath() {

            return this._filePath;
        }
    }
}