namespace phasereditor2d.scene.ui.sceneobjects {

    export class RemoveObjectsFromListOperation extends ListsSnapshotOperation {

        private _objects: ISceneGameObject[];
        private _list: ObjectList;

        constructor(editor: editor.SceneEditor, list: ObjectList, objects: ISceneGameObject[]) {
            super(editor);

            this._list = list;
            this._objects = objects;
        }

        performChange(lists: ObjectLists): void {

            const objectsInListIds = this._list.getObjectIds();

            const objectsIds = new Set(this._objects.map(obj => obj.getEditorSupport().getId()));

            this._list.setObjectsIds(objectsInListIds.filter(id => !objectsIds.has(id)));

            delete this._list;
            delete this._objects;
        }
    }
}