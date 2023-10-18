namespace phasereditor2d.scene.ui.codesnippets {

    export interface ICodeSnippetData {
        type: string;
        id: string;
    }

    export abstract class CodeSnippet {

        private _type: string;
        private _id: string;

        constructor(type: string) {

            this._type = type;
            this._id = Phaser.Utils.String.UUID();
        }

        getId() {

            return this._id;
        }

        getType() {

            return this._type;
        }

        abstract buildCodeDOM(): core.code.CodeDOM[];

        abstract getDisplayName(): string;

        writeJSON(data: ICodeSnippetData): void {

            data.type = this._type;
            data.id = this._id;
        }

        readJSON(data: ICodeSnippetData) {

            this._id = data.id;
        }
    }
}