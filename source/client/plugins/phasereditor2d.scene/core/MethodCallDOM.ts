namespace phasereditor2d.scene.core {

    export class MethodCallDOM extends CodeDOM {

        private _methodName: string;
        private _contextExpr: string;
        private _args: string[];
        private _returnToVar: string;
        private _declareReturnToVar: boolean;

        constructor(methodName: string, contextExpr: string) {
            super();

            this._methodName = methodName;
            this._contextExpr = contextExpr;
            this._args = [];
            this._declareReturnToVar = true;
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

        arg(expr: string) {
            this._args.push(expr);
        }

        argLiteral(expr: string) {
            this._args.push(CodeDOM.quote(expr));
        }

        argFloat(n: number) {
            // tslint:disable-next-line:no-construct
            this._args.push(new Number(n).toString());
        }

        argInt(n: number) {
            // tslint:disable-next-line:no-construct
            this._args.push(new Number(Math.floor(n)).toString());
        }

        getMethodName() {
            return this._methodName;
        }

        getContextExpr() {
            return this._contextExpr;
        }

        getArgs() {
            return this._args;
        }
    }
}