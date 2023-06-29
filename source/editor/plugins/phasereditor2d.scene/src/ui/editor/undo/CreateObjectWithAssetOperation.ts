/// <reference path="./SceneSnapshotOperation.ts" />
namespace phasereditor2d.scene.ui.editor.undo {

    import io = colibri.core.io;

    export class CreateObjectWithAssetOperation extends SceneSnapshotOperation {

        private _offsetX: number;
        private _offsetY: number;
        private _data: any[];

        constructor(editor: SceneEditor, data: any[], offsetX = 0, offsetY = 0) {
            super(editor);

            this._offsetX = offsetX;
            this._offsetY = offsetY;
            this._data = data;
        }

        protected async performModification() {

            const editor = this.getEditor();

            let isScriptNode = false;

            if (this._data.length === 1) {

                const finder = ScenePlugin.getInstance().getSceneFinder();

                const asset = this._data[0];

                isScriptNode = asset instanceof io.FilePath
                    && finder.isScriptPrefabFile(asset)
                    || asset instanceof sceneobjects.ScriptNodeExtension;
            }

            const sel = editor.getSelectedGameObjects();

            if (isScriptNode && sel.length > 0) {

                // We are dropping a script node,
                // so we should go for every object selected in the scene
                // and add the script.
                // It is different from adding a regular game object,
                // where only one instance is created

                const newSprites = [];

                const script = this._data[0];

                for (const obj of sel) {

                    const sprites = await editor.getDropManager()
                        .createWithDropEvent([script], 0, 0, [obj]);

                    newSprites.push(...sprites);
                }

                editor.setSelection(newSprites);

            } else {

                const sprites = await editor.getDropManager()
                    .createWithDropEvent(this._data, this._offsetX, this._offsetY);

                editor.setSelection(sprites);
            }
        }
    }
}