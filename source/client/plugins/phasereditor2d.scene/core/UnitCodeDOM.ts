namespace phasereditor2d.scene.core {

    export class UnitCodeDOM {

        private _elements: object[];

        constructor(elements: object[]) {
            this._elements = elements;
        }

        getElements() {
            return this._elements;
        }

        setElements(elements: object[]) {
            this._elements = elements;
        }
    }
}