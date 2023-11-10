/// <reference path="../editor/undo/SceneEditorOperation.ts" />
namespace phasereditor2d.scene.ui.codesnippets {

    import json = core.json;

    export interface ICodeSnippetSnapshot {

        selection: string[];
        codeSnippets: ICodeSnippetData[];
    }

    export class CodeSnippetsSnapshotOperation extends editor.undo.SceneEditorOperation {

        private _before: ICodeSnippetSnapshot;
        private _after: ICodeSnippetSnapshot;
        private _operation: () => Promise<void>;

        constructor(editor: editor.SceneEditor, operation?: () => Promise<void>) {
            super(editor);

            this._operation = operation;
        }

        async execute() {

            this._before = this.takeSnapshot();

            await this.performModification();

            this._after = this.takeSnapshot();

            this._editor.setDirty(true);
            this._editor.refreshOutline();
            this._editor.repaint();
            this._editor.dispatchSelectionChanged();
        }

        protected async performModification(): Promise<void> {

            if (this._operation) {

                await this._operation();
            }
        }

        private takeSnapshot(): ICodeSnippetSnapshot {

            const scene = this.getScene();

            return {
                selection: this.getEditor().getSelectedCodeSnippets().map(s => s.getId()),
                codeSnippets: scene.getCodeSnippets().toJSON()
            };
        }

        protected loadSnapshot(snapshot: ICodeSnippetSnapshot) {

            const editor = this.getEditor();
            const scene = this.getScene();

            scene.getCodeSnippets().readJSON(snapshot.codeSnippets);

            editor.setDirty(true);
            editor.repaint();
            editor.refreshOutline();
            editor.getSelectionManager().setSelectionByIds(snapshot.selection);
        }

        undo(): void {

            this.loadSnapshot(this._before);
        }

        redo(): void {

            this.loadSnapshot(this._after);
        }
    }
}