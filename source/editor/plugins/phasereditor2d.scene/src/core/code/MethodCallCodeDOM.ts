namespace phasereditor2d.scene.core.code {

    export class MethodCallCodeDOM extends CodeDOM {

        private _methodName: string;
        private _contextExpr: string;
        private _args: string[];
        private _returnToVar: string;
        private _declareReturnToVar: boolean;
        private _isConstructor: boolean;
        private _explicitType: string;
        private _optionalContext: boolean;
        private _nonNullAssertion: boolean;

        constructor(methodName: string, contextExpr = "") {
            super();

            this._methodName = methodName;
            this._contextExpr = contextExpr;
            this._args = [];
            this._declareReturnToVar = false;
            this._isConstructor = false;
            this._nonNullAssertion = false;
        }

        setNonNullAssertion(nonNullAssertion: boolean) {

            this._nonNullAssertion = nonNullAssertion;
        }

        isNonNullAssertion() {

            return this._nonNullAssertion;
        }

        setOptionalContext(optionalContext: boolean) {

            this._optionalContext = optionalContext;
        }

        isOptionalContext() {

            return this._optionalContext;
        }

        isConstructor() {

            return this._isConstructor;
        }

        setConstructor(isConstructor: boolean) {

            this._isConstructor = isConstructor;
        }

        getReturnToVar() {

            return this._returnToVar;
        }

        setReturnToVar(returnToVar: string) {

            this._returnToVar = returnToVar;
        }

        setDeclareReturnToVar(declareReturnToVar: boolean) {

            this._declareReturnToVar = declareReturnToVar;
        }

        isDeclareReturnToVar() {

            return this._declareReturnToVar;
        }

        setExplicitType(explicitType: string) {

            this._explicitType = explicitType;
        }

        getExplicitType() {

            return this._explicitType;
        }

        arg(expr: string) {

            this._args.push(expr);
        }

        argUndefined() {

            this.arg("undefined");
        }

        argStringOrFloat(expr: string | number) {

            switch (typeof expr) {

                case "string":
                    this.argLiteral(expr);
                    break;

                case "number":
                    this.argFloat(expr);
                    break;
            }
        }

        argStringOrInt(expr: string | number) {

            switch (typeof expr) {

                case "string":
                    this.argLiteral(expr);
                    break;

                case "number":
                    this.argInt(expr);
                    break;

                case "undefined":
                    this.arg("undefined");
                    break;
            }
        }

        argLiteral(expr: string) {

            this._args.push(CodeDOM.quote(expr));
        }

        argFloat(n: number) {

            this._args.push(n + "");
        }

        argInt(n: number) {

            this._args.push(Math.floor(n) + "");
        }

        argBool(b: boolean) {

            this.arg(b ? "true" : "false");
        }

        getMethodName() {

            return this._methodName;
        }

        setMethodName(methodName: string) {

            this._methodName = methodName;
        }

        getContextExpr() {

            return this._contextExpr;
        }

        getArgs() {

            return this._args;
        }
    }
}