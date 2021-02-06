namespace phasereditor2d.scene.ui.sceneobjects {

    export class AddObjectsToNewListOperation extends ListsSnapshotOperation {

        private _objects: ISceneGameObject[];
        private _label: string;

        constructor(editor: editor.SceneEditor, label: string, objects: ISceneGameObject[]) {
            super(editor);

            this._label = label;
            this._objects = objects;
        }

        performChange(lists: ObjectLists): void {

            const list = new ObjectList();

            list.setLabel(this._label);

            list.getObjectIds().push(... this._objects.map(obj => obj.getEditorSupport().getId()));

            lists.getLists().push(list);
        }
    }
}