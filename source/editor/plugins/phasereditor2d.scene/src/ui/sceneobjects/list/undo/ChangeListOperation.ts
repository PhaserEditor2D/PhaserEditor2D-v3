namespace phasereditor2d.scene.ui.sceneobjects {

    import json = core.json;

    export class ChangeListOperation extends editor.undo.SceneEditorOperation {

        private _performChange: (list: ObjectList) => void;
        private _list: ObjectList;
        private _before: json.IObjectListData;
        private _after: json.IObjectListData;

        constructor(editor: editor.SceneEditor, list: ObjectList, performChange: (list: ObjectList) => void) {
            super(editor);

            this._list = list;
            this._performChange = performChange;
        }

        async execute() {

            this._before = {} as any;
            this._list.writeJSON(this._before);

            this._performChange(this._list);

            this._after = {} as any;
            this._list.writeJSON(this._after);

            delete this._list;

            this.loadData(this._after);
        }

        loadData(listData: json.IObjectListData) {

            const list = this._editor.getScene().getObjectLists().getListById(listData.id);

            list.readJSON(listData);

            this._editor.setDirty(true);
            this._editor.refreshOutline();
            this._editor.dispatchSelectionChanged();
        }

        undo(): void {

            this.loadData(this._before);
        }

        redo(): void {

            this.loadData(this._after);
        }
    }
}