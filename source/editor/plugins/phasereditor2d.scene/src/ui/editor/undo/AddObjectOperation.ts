/// <reference path="./SceneSnapshotOperation.ts" />

namespace phasereditor2d.scene.ui.editor.undo {

    import io = colibri.core.io;

    export class AddObjectOperation extends SceneSnapshotOperation {

        private _type: sceneobjects.SceneObjectExtension | io.FilePath;
        private _extraData: any;

        constructor(editor: SceneEditor, type: sceneobjects.SceneObjectExtension | io.FilePath, extraData: any) {
            super(editor);

            this._type = type;
            this._extraData = extraData;
        }

        protected async performModification() {

            const maker = this._editor.getSceneMaker();

            let obj: sceneobjects.ISceneObject;

            if (this._type instanceof io.FilePath) {

                obj = await maker.createPrefabInstanceWithFile(this._type);

            } else {

                obj = maker.createEmptyObject(this._type, this._extraData);
            }

            this.getEditor().setSelection([obj]);
        }
    }
}