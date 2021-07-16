/// <reference path="./MemberDeclCodeDOM.ts" />

namespace phasereditor2d.scene.core.code {

    export class ClassDeclCodeDOM extends MemberDeclCodeDOM {

        private _exportClass: boolean;
        private _body: Array<MemberDeclCodeDOM|UserSectionCodeDOM>;
        private _constructor: MethodDeclCodeDOM;
        private _superClass: string;

        constructor(name: string) {
            super(name);

            this._body = [];
            this._exportClass = false;
        }


        isExportClass() {

            return this._exportClass;
        }

        setExportClass(exportClass: boolean) {

            this._exportClass = exportClass;
        }

        getConstructor() {

            return this._constructor;
        }

        setConstructor(constructor: MethodDeclCodeDOM) {

            this._constructor = constructor;
        }

        getSuperClass() {

            return this._superClass;
        }

        setSuperClass(superClass: string) {

            this._superClass = superClass;
        }

        getBody() {

            return this._body;
        }
    }
}