/// <reference path="./ListsSnapshotOperation.ts" />

namespace phasereditor2d.scene.ui.sceneobjects {

    import json = core.json;

    export class RemoveObjectListOperation extends ListsSnapshotOperation {

        private _toDeleteArray: ObjectList[];

        constructor(editor: editor.SceneEditor, toDeleteArray: ObjectList[]) {
            super(editor);

            this._toDeleteArray = toDeleteArray;
        }

        performChange(sceneLists: ObjectLists): void {

            for (const list of this._toDeleteArray) {

                const i = sceneLists.getLists().indexOf(list);

                sceneLists.getLists().splice(i, 1);
            }

            this._editor.refreshOutline();

            this._editor.setSelection([]);
        }
    }
}