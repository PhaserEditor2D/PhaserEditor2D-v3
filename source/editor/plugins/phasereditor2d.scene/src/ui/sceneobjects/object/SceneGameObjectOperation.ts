namespace phasereditor2d.scene.ui.sceneobjects {

    export abstract class SceneGameObjectOperation<T extends ISceneGameObjectLike> extends editor.undo.SceneEditorOperation {

        private _objIdList: string[];
        private _value: any;
        private _values1: any[];
        private _values2: any[];
        private _objects: any[];

        constructor(editor: editor.SceneEditor, objects: T[], value: any) {
            super(editor);

            this._objects = objects;
            this._value = value;
        }

        abstract getValue(obj: T): any;

        abstract setValue(obj: T, value: any): void;

        async execute() {

            this._objIdList = this._objects.map(obj => obj.getEditorSupport().getId());

            this._values1 = this._objects.map(_ => this._value);

            this._values2 = this._objects.map(obj => this.getValue(obj));

            // don't keep the objects reference, we have the ids.
            this._objects = null;

            this.update(this._values1);
        }

        undo(): void {

            this.update(this._values2);
        }

        redo(): void {

            this.update(this._values1);
        }

        private update(values: any[]) {

            for (let i = 0; i < this._objIdList.length; i++) {

                const id = this._objIdList[i];
                const obj = this._editor.getScene().getByEditorId(id);
                const value = values[i];

                if (obj) {
                    this.setValue(obj, value);
                }
            }

            this._editor.setSelection(this._editor.getSelection());
            this._editor.setDirty(true);
        }
    }
}