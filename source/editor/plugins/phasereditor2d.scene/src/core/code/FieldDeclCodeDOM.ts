namespace phasereditor2d.scene.core.code {

    export class FieldDeclCodeDOM extends MemberDeclCodeDOM {

        private _type: string;
        private _publicScope: boolean;
        private _initialValueExpr: string;
        private _allowUndefined: boolean;
        private _interfaceMember: boolean;

        constructor(name: string, type: string, publicScope: boolean = false) {
            super(name);

            this._type = type;
            this._publicScope = publicScope;
            this._initialValueExpr = null;
            this._allowUndefined = false;
            this._interfaceMember = false;
        }

        isInterfaceMember() {

            return this._interfaceMember;
        }

        setInterfaceMember(interfaceMember: boolean) {
            
            this._interfaceMember = interfaceMember;
        }

        isAllowUndefined() {

            return this._allowUndefined;
        }

        setAllowUndefined(allowUndefined: boolean) {

            this._allowUndefined = allowUndefined;
        }

        isInitialized() {

            return this._initialValueExpr !== null && this._initialValueExpr !== undefined && this._initialValueExpr.length > 0;
        }

        getInitialValueExpr() {

            return this._initialValueExpr;
        }

        setInitialValueExpr(expr: string) {

            this._initialValueExpr = expr;
        }

        isPublic() {

            return this._publicScope;
        }

        setPublic(publicScope: boolean) {

            this._publicScope = publicScope;
        }

        getType() {

            return this._type;
        }

        setType(type: string) {

            this._type = type;
        }

        getStrictType() {

            if (this.isAllowUndefined()) {

                return this._type + " | undefined";
            }

            return this._type;
        }
    }
}