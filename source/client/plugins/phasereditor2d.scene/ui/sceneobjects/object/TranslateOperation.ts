namespace phasereditor2d.scene.ui.sceneobjects {

    export class TranslateOperation extends editor.undo.SceneEditorOperation {

        private _objects: any[];
        private _values0: Map<string, { x: number, y: number }>;
        private _values1: Map<string, { x: number, y: number }>;

        constructor(editor: editor.SceneEditor, toolArgs: editor.tools.ISceneToolContextArgs) {
            super(editor);

            this._objects = toolArgs.objects;

            this._values0 = new Map();
            this._values1 = new Map();
        }

        execute() {

            for (const obj of this._objects) {

                const sprite = obj as ITransformLikeObject;

                const value0 = TranslateToolItem.getInitObjectPosition(sprite);
                const value1 = { x: sprite.x, y: sprite.y };

                const id = sprite.getEditorSupport().getId();

                this._values0.set(id, value0);
                this._values1.set(id, value1);
            }
        }

        private setValues(values: Map<string, { x: number, y: number }>) {

            for (const obj of this._objects) {

                const sprite = obj as ITransformLikeObject;

                const id = sprite.getEditorSupport().getId();

                const { x, y } = values.get(id);

                sprite.x = x;
                sprite.y = y;
            }

            this._editor.setDirty(true);
            this._editor.dispatchSelectionChanged();
        }

        undo(): void {

            this.setValues(this._values0);
        }

        redo(): void {

            this.setValues(this._values1);
        }
    }
}