namespace phasereditor2d.scene.core.code {

    export class RawCodeDOM extends CodeDOM {

        private _code: string;

        static many(...codes: string[]) {

            return codes.map(code => new RawCodeDOM(code));
        }

        constructor(code = "") {
            super();

            this._code = code;
        }

        getCode() {
            return this._code;
        }
    }
}