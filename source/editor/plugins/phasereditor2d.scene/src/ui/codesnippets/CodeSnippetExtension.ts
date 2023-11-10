
namespace phasereditor2d.scene.ui.codesnippets {

    export abstract class CodeSnippetExtension extends colibri.Extension {

        static POINT_ID = "phasereditor2d.scene.ui.codesnippets.CodeSnippetExtension";

        private _name: string;
        private _type: string;

        constructor(type: string, name: string) {
            super(CodeSnippetExtension.POINT_ID);

            this._type = type;
            this._name = name;
        }

        getType() {

            return this._type;
        }

        getName() {

            return this._name;
        }

        abstract isEnabledFor(_editor: editor.SceneEditor): boolean;

        abstract createAndConfigureCodeSnippets(): Promise<CodeSnippet[]>;

        abstract createEmptyCodeSnippet(): CodeSnippet;
    }
}