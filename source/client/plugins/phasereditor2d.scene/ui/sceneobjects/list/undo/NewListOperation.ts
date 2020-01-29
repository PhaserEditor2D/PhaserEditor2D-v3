namespace phasereditor2d.scene.ui.sceneobjects {

    export class NewListOperation extends ListsSnapshotOperation {

        performChange(lists: ObjectLists): void {

            const list = new ObjectList();

            list.setLabel(this.getEditor().getScene().makeNewName("list"));

            lists.getLists().push(list);

            this.getEditor().setSelection([list]);
        }
    }
}