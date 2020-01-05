namespace phasereditor2d.scene.core.code {

    export class MethodDeclCodeDOM extends MemberDeclCodeDOM {

        private _body: CodeDOM[];

        constructor(name: string) {
            super(name);

            this._body = [];
        }

        getBody() {
            return this._body;
        }

        setBody(body: CodeDOM[]) {
            this._body = body;
        }
    }
}