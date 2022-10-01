namespace phasereditor2d.scene.ui.sceneobjects {

    export abstract class SceneGameObjectOperation<T extends ISceneObject> extends editor.undo.SceneEditorOperation {

        private _objIdList: string[];
        private _value: any;
        private _afterValues: any[];
        private _beforeValues: any[];
        private _objects: any[];

        constructor(editor: editor.SceneEditor, objects: T[], value?: any) {
            super(editor);

            this._objects = objects;
            this._value = value;
        }

        abstract getValue(obj: T): any;

        abstract setValue(obj: T, value: any): void;

        protected transformValue(obj: T): any {

            return this._value;
        }

        async execute() {

            this._objIdList = this._objects.map(obj => obj.getEditorSupport().getId());

            this._beforeValues = this._objects.map(obj => this.getValue(obj));
            
            this._afterValues = this._objects.map(obj => this.transformValue(obj));

            // don't keep the objects reference, we have the ids.
            this._objects = null;

            this.update(this._afterValues);
        }

        undo(): void {

            this.update(this._beforeValues);
        }

        redo(): void {

            this.update(this._afterValues);
        }

        private update(values: any[]) {

            const scene = this._editor.getScene();

            for (let i = 0; i < this._objIdList.length; i++) {

                const id = this._objIdList[i];
                const obj = scene.getPlainObjectById(id) || scene.getByEditorId(id);
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