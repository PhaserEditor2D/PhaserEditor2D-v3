namespace phasereditor2d.scene.core.code {

    export class FieldDeclCodeDOM extends MemberDeclCodeDOM {

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