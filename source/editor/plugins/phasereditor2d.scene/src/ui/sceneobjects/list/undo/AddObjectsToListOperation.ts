namespace phasereditor2d.scene.ui.sceneobjects {

    export class AddObjectsToListOperation extends ListsSnapshotOperation {

        private _objects: ISceneGameObject[];
        private _list: ObjectList;

        constructor(editor: editor.SceneEditor, list: ObjectList, objects: ISceneGameObject[]) {
            super(editor);

            this._list = list;
            this._objects = objects;
        }

        performChange(lists: ObjectLists): void {

            this._list.getObjectIds().push(... this._objects.map(obj => obj.getEditorSupport().getId()));

            delete this._list;
            delete this._objects;
        }
    }
}