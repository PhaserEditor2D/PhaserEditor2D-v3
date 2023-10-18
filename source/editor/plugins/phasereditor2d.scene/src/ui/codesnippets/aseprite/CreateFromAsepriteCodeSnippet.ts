namespace phasereditor2d.scene.ui.codesnippets {

    export interface ICreateFromAsepriteCodeSnippetData extends ICodeSnippetData {
        key: string;
    }

    export class CreateFromAsepriteCodeSnippet extends CodeSnippet {

        public assetKey: string;

        constructor() {
            super(CreateFromAsepriteCodeSnippetExtension.TYPE);
        }

        buildCodeDOM(): core.code.CodeDOM[] {

            const dom = new core.code.MethodCallCodeDOM("createFromAseprite", "this.anims");

            dom.argLiteral(this.assetKey);

            return [dom];
        }

        getDisplayName(): string {

            return `${this.assetKey} - anims.createFromAseprite`;
        }

        writeJSON(data: ICreateFromAsepriteCodeSnippetData): void {
        
            super.writeJSON(data);

            data.key = this.assetKey;
        }

        readJSON(data: ICreateFromAsepriteCodeSnippetData): void {
            
            super.readJSON(data);
            
            this.assetKey = data.key;
        }
    }
}