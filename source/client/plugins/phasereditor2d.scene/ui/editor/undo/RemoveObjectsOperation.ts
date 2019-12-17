namespace phasereditor2d.scene.ui.editor.undo {

    export class RemoveObjectsOperation extends AddObjectsOperation {


        constructor(editor: SceneEditor, objects: gameobjects.EditorObject[]) {
            super(editor, objects);
        }

        undo(): void {
            super.redo();
        }

        redo(): void {
            super.undo();
        }
    }

}