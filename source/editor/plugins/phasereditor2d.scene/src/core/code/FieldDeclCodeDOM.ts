namespace phasereditor2d.scene.core.code {

    export class FieldDeclCodeDOM extends MemberDeclCodeDOM {

        private _type: string;
        private _publicScope: boolean;
        private _initialValueExpr: string;
        private _initInConstructor: boolean;

        constructor(name: string, type: string, publicScope: boolean = false) {
            super(name);

            this._type = type;
            this._publicScope = publicScope;
            this._initialValueExpr = null;
            this._initInConstructor = false;
        }

        setInitInConstructor(initInConstructor: boolean) {

            this._initInConstructor = initInConstructor;
        }

        isInitInConstructor() {

            return this._initInConstructor;
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
    }
}