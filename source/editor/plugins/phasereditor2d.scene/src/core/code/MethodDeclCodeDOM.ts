namespace phasereditor2d.scene.core.code {

    export interface IArgCodeDOM {

        name: string;
        type: string;
        optional: boolean;
    }

    export class MethodDeclCodeDOM extends MemberDeclCodeDOM {

        private _modifiers: string[];
        private _body: CodeDOM[];
        private _args: IArgCodeDOM[];
        private _returnType: string;

        constructor(name: string) {
            super(name);

            this._modifiers = [];
            this._args = [];
            this._body = [];
        }

        getReturnType() {

            return this._returnType;
        }

        setReturnType(returnType: string) {

            this._returnType = returnType;
        }

        getModifiers() {

            return this._modifiers;
        }

        arg(name: string, type: string, optional = false) {

            this._args.push({
                name, type, optional
            });
        }

        getArgs() {

            return this._args;
        }

        getBody() {

            return this._body;
        }

        setBody(body: CodeDOM[]) {

            this._body = body;
        }
    }
}