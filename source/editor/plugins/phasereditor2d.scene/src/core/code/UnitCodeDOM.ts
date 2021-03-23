namespace phasereditor2d.scene.core.code {

    export class UnitCodeDOM {

        private _body: CodeDOM[];

        constructor(elements: CodeDOM[]) {

            this._body = elements;
        }

        getBody() {

            return this._body;
        }

        setBody(body: CodeDOM[]) {

            this._body = body;
        }
    }
}