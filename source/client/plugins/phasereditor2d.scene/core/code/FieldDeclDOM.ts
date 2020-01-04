namespace phasereditor2d.scene.core.code {

    export class FieldDeclDOM extends MemberDeclDOM {

        private _type: string;

        constructor(name: string) {
            super(name);
        }

        getType() {
            return this._type;
        }

        setType(type: string) {
            this._type = type;
        }
    }
}