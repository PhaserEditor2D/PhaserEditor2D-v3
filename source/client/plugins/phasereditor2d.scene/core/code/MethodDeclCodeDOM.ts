namespace phasereditor2d.scene.core.code {

    export interface IArgCodeDOM {

        name: string;
        type: string;
        optional: boolean;
    }

    export class MethodDeclCodeDOM extends MemberDeclCodeDOM {

        private _body: CodeDOM[];
        private _args: IArgCodeDOM[];

        constructor(name: string) {
            super(name);

            this._args = [];
            this._body = [];
        }

        addArg(name: string, type: string, optional = false) {
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