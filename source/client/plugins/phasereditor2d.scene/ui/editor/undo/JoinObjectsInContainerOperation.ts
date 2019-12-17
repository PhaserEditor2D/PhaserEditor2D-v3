namespace phasereditor2d.scene.ui.editor.undo {

    export class JoinObjectsInContainerOperation extends SceneEditorOperation {

        private _containerId: string;
        private _objectsIdList: string[];

        constructor(editor: SceneEditor, container: gameobjects.EditorContainer) {
            super(editor);

            this._containerId = container.getEditorId();

            this._objectsIdList = container.list.map(obj => obj.getEditorId());

        }

        undo(): void {

            const scene = this._editor.getGameScene();
            
            const displayList = this._editor.getGameScene().sys.displayList;

            const container = scene.getByEditorId(this._containerId) as gameobjects.EditorContainer;

            for (const id of this._objectsIdList) {

                const obj = GameScene.findByEditorId(container.list, id);

                if (obj) {

                    container.remove(obj);

                    displayList.add(obj);

                } else {
                    console.error(`Undo: child with id=${id} not found in container ${this._containerId}`);
                }

            }

            container.destroy();

            this.updateEditor();

        }

        redo(): void {

            const scene = this._editor.getGameScene();

            const objects = this._objectsIdList.map(id => scene.getByEditorId(id));

            const container = this._editor.getSceneMaker().createContainerWithObjects(objects);

            container.setEditorId(this._containerId);

            this.updateEditor();
        }

        private updateEditor() {

            this._editor.setDirty(true);
            this._editor.refreshOutline();
            this._editor.repaint();

        }


    }

}