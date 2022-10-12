/// <reference path="./MemberDeclCodeDOM.ts" />

namespace phasereditor2d.scene.core.code {

    export class InterfaceDeclCodeDOM extends MemberDeclCodeDOM {

        private _exportInterface: boolean;
        private _body: Array<FieldDeclCodeDOM>;

        constructor(name: string) {
            super(name);

            this._body = [];
            this._exportInterface = false;
        }

        isExportInterface() {

            return this._exportInterface;
        }

        setExportInterface(exportClass: boolean) {

            this._exportInterface = exportClass;
        }

        getBody() {

            return this._body;
        }
    }
}