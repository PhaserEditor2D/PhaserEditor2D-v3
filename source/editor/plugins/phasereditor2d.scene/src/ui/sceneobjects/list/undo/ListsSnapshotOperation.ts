namespace phasereditor2d.scene.ui.sceneobjects {

    import json = core.json;

    export abstract class ListsSnapshotOperation extends editor.undo.SceneEditorOperation {

        private _before: json.IObjectListData[];
        private _after: json.IObjectListData[];
        private _selection: string[];

        constructor(editor: editor.SceneEditor) {
            super(editor);
        }

        abstract performChange(lists: ObjectLists): void;

        async execute() {

            const scene = this._editor.getScene();

            const lists = scene.getObjectLists();

            this._before = lists.toJSON_lists();
            this._selection = this._editor.getSelectionManager().getSelectionIds();

            this.performChange(lists);

            this._after = lists.toJSON_lists();

            this.loadData(this._after);
        }

        private loadData(data: json.IObjectListData[]) {

            const lists = this._editor.getScene().getObjectLists();

            lists.readJSON_lists(data);

            this._editor.setDirty(true);

            this._editor.refreshOutline();

            this._editor.getSelectionManager().setSelectionByIds(this._selection);
        }

        undo(): void {

            this.loadData(this._before);
        }

        redo(): void {

            this.loadData(this._after);
        }
    }
}