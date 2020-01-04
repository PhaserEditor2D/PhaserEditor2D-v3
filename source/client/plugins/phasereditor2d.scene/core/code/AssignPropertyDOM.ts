namespace phasereditor2d.scene.core.code {

    export class AssignPropertyDOM {

        private _propertyName: string;
        private _propertyValueExpr: string;
        private _contextExpr: string;
        private _propertyType: string;

        constructor(propertyName: string, contentExpr: string) {
            this._propertyName = propertyName;
            this._contextExpr = contentExpr;
        }

        value(expr: string) {
            this._propertyValueExpr = expr;
        }

        valueLiteral(expr: string) {
            this._propertyValueExpr = CodeDOM.quote(expr);
        }

        valueFloat(n: number) {
            // tslint:disable-next-line:no-construct
            this._propertyValueExpr = new Number(n).toString();
        }

        valueInt(n: number) {
            // tslint:disable-next-line:no-construct
            this._propertyValueExpr = new Number(Math.floor(n)).toString();
        }

        valueBool(b: boolean) {
            // tslint:disable-next-line:no-construct
            this._propertyValueExpr = new Boolean(b).toString();
        }

        getPropertyName() {
            return this._propertyName;
        }

        getContentExpr() {
            return this._contextExpr;
        }

        getPropertyValueExpr() {
            return this._propertyValueExpr;
        }

        getPropertyType() {
            return this._propertyType;
        }

        setPropertyType(propertyType: string) {
            this._propertyType = propertyType;
        }
    }
}