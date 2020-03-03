/// <reference path="./MemberDeclCodeDOM.ts" />

namespace phasereditor2d.scene.core.code {

    export class ClassDeclCodeDOM extends MemberDeclCodeDOM {

        private _body: MemberDeclCodeDOM[];
        private _constructor: MethodDeclCodeDOM;
        private _superClass: string;

        constructor(name: string) {
            super(name);

            this._body = [];
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