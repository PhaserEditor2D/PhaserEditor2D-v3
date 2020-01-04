/// <reference path="./MemberDeclDOM.ts" />

namespace phasereditor2d.scene.core {

    export class ClassDeclCodeDOM extends MemberDeclDOM {

        private _members: MemberDeclDOM[];
        private _constructor: MethodDeclDOM;
        private _superClass: string;

        constructor(name: string) {
            super(name);

            this._members = [];
        }

        getConstructor() {
            return this._constructor;
        }

        setConstructor(constructor: MethodDeclDOM) {
            this._constructor = constructor;
        }

        getSuperClass() {
            return this._superClass;
        }

        setSuperClass(superClass: string) {
            this._superClass = superClass;
        }

        getMembers() {
            return this._members;
        }
    }
}