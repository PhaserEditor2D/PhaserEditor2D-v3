namespace phasereditor2d.scene.core {

    export class MethodDeclDOM extends MemberDeclDOM {

        private _instructions: CodeDOM[];

        constructor(name: string) {
            super(name);
        }

        getInstructions() {
            return this._instructions;
        }

        setInstructions(instructions: CodeDOM[]) {
            this._instructions = instructions;
        }
    }
}