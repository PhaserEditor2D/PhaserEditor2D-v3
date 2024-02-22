/// <reference path="./CodeDOM.ts" />

namespace phasereditor2d.scene.core.code {

    export class AssignPropertyCodeDOM extends CodeDOM {

        private _propertyName: string;
        private _propertyValueExpr: string;
        private _contextExpr: string;
        private _propertyType: string;
        private _optionalContext: boolean;

        constructor(propertyName: string, context?: string) {
            super();

            this._propertyName = propertyName;
            this._contextExpr = context;
            this._optionalContext = false;
        }

        setOptionalContext(optionalContext: boolean) {

            this._optionalContext = optionalContext;
        }

        isOptionalContext() {

            return this._optionalContext;
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

        getContextExpr() {

            return this._contextExpr;
        }

        setContextExpr(contextExpr: string) {

            this._contextExpr = contextExpr;
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