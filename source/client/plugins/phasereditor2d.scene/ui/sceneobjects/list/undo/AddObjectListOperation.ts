/// <reference path="./ListsSnapshotOperation.ts" />

namespace phasereditor2d.scene.ui.sceneobjects {

    import json = core.json;

    export class AddObjectListOperation extends ListsSnapshotOperation {

        private _list: ObjectList;

        constructor(editor: editor.SceneEditor, list: ObjectList) {
            super(editor);

            this._list = list;
        }

        performChange(lists: ObjectLists): void {

            lists.getLists().push(this._list);

            this._editor.refreshOutline();

            this._editor.setSelection([this._list]);
        }
    }
}