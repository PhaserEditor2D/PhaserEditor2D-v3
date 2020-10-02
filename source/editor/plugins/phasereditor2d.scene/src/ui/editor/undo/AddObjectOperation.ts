/// <reference path="./SceneSnapshotOperation.ts" />

namespace phasereditor2d.scene.ui.editor.undo {

    import io = colibri.core.io;

    export class AddObjectOperation extends SceneSnapshotOperation {

        private _type: sceneobjects.SceneGameObjectExtension | io.FilePath;
        private _extraData: any;

        constructor(editor: SceneEditor, type: sceneobjects.SceneGameObjectExtension | io.FilePath, extraData: any) {
            super(editor);

            this._type = type;
            this._extraData = extraData;
        }

        protected async performModification() {

            const prefabObj = this._editor.getScene().getPrefabObject();

            const maker = this._editor.getSceneMaker();

            let obj: sceneobjects.ISceneObject;

            if (this._type instanceof io.FilePath) {

                obj = await maker.createPrefabInstanceWithFile(this._type);

            } else {

                obj = maker.createDefaultObject(this._type, this._extraData);
            }

            // TODO
            // this._editor.getSceneMaker().afterDropObjects(prefabObj, [obj]);
            if (obj instanceof Phaser.GameObjects.GameObject) {

                this._editor.getSceneMaker().afterDropObjects(prefabObj, [obj]);
            }

            this.getEditor().setSelection([obj]);
        }
    }
}