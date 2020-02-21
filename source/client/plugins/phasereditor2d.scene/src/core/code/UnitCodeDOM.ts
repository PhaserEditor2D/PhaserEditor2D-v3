namespace phasereditor2d.scene.core.code {

    export class UnitCodeDOM {

        private _body: object[];

        constructor(elements: object[]) {
            this._body = elements;
        }

        getBody() {
            return this._body;
        }

        setBody(body: object[]) {
            this._body = body;
        }
    }
}