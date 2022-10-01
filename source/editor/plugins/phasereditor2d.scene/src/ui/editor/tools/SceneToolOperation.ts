namespace phasereditor2d.scene.ui.editor.tools {

    export abstract class SceneToolOperation<TValue> extends undo.SceneEditorOperation {

        private _objects: any[];
        private _values0: Map<string, TValue>;
        private _values1: Map<string, TValue>;

        constructor(toolArgs: editor.tools.ISceneToolContextArgs) {
            super(toolArgs.editor);

            this._objects = toolArgs.objects;

            this._values0 = new Map();
            this._values1 = new Map();
        }

        async execute() {

            for (const obj of this._objects) {

                const sprite = obj as sceneobjects.ISceneGameObject;

                const value0 = this.getInitialValue(sprite);
                const value1 = this.getFinalValue(sprite);

                const id = sprite.getEditorSupport().getId();

                this._values0.set(id, value0);
                this._values1.set(id, value1);
            }

            this.getEditor().setDirty(true);
        }

        abstract getInitialValue(obj: any): TValue;

        abstract getFinalValue(obj: any): TValue;

        abstract setValue(obj: any, value: TValue);

        private setValues(values: Map<string, TValue>) {

            for (const obj of this._objects) {

                const sprite = obj as sceneobjects.ISceneGameObject;

                const id = sprite.getEditorSupport().getId();

                const value = values.get(id);

                this.setValue(obj, value);
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