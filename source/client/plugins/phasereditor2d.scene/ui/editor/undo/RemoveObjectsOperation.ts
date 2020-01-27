namespace phasereditor2d.scene.ui.editor.undo {

    export class RemoveObjectsOperation extends AddObjectsOperation {

        private _objects: sceneobjects.ISceneObject[];

        constructor(editor: SceneEditor, objects: sceneobjects.ISceneObject[]) {
            super(editor, objects);

            this._objects = objects;
        }

        execute() {

            for (const obj of this._objects) {

                obj.getEditorSupport().destroy();
            }
        }

        undo(): void {

            super.redo();
        }

        redo(): void {

            super.undo();
        }
    }

}