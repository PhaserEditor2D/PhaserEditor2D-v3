namespace phasereditor2d.scene.core.code {

    export class FieldDeclCodeDOM extends MemberDeclCodeDOM {

        private _type: string;
        private _publicScope: boolean;

        constructor(name: string, type: string, publicScope: boolean = false) {
            super(name);

            this._type = type;
            this._publicScope = publicScope;
        }

        isPublic() {
            return this._publicScope;
        }

        getType() {
            return this._type;
        }
    }
}