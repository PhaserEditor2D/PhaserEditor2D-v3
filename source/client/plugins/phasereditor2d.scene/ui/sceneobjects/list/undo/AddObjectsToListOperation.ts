namespace phasereditor2d.scene.ui.sceneobjects {

    export class AddObjectsToListOperation extends GlobalListOperation {

        private _objects: ISceneObject[];
        private _list: ObjectList;

        constructor(editor: editor.SceneEditor, list: ObjectList, objects: ISceneObject[]) {
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