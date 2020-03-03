/// <reference path="./CodeDOM.ts" />

namespace phasereditor2d.scene.core.code {

    export class MemberDeclCodeDOM extends CodeDOM {

        private _name: string;

        constructor(name: string) {
            super();

            this._name = name;
        }

        getName() {
            return this._name;
        }
    }
}