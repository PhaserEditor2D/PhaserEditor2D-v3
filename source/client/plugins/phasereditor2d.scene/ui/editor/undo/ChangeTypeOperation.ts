namespace phasereditor2d.scene.ui.editor.undo {

    import controls = colibri.ui.controls;
    import io = colibri.core.io;

    export class ChangeTypeOperation extends undo.SceneEditorOperation {

        private _targetType: sceneobjects.SceneObjectExtension | io.FilePath;
        private _currentObjectData: core.json.IObjectData;

        constructor(editor: SceneEditor, targetType: sceneobjects.SceneObjectExtension | io.FilePath) {
            super(editor);

            this._targetType = targetType;
        }

        execute() {

            const sel = this.getEditor().getSelection()
                .filter(obj => obj instanceof Phaser.GameObjects.GameObject);

            const objects: sceneobjects.ISceneObject[] = [];

            for (const obj of sel) {

                const sceneObj = obj as sceneobjects.ISceneObject;

                const support = sceneObj.getEditorSupport();

                if (support.isPrefabInstance()) {

                    if (this._targetType === support.getPrefabFile()) {

                        continue;
                    }

                } else if (support.getExtension() !== this._targetType) {

                    continue;
                }

                objects.push(obj);
            }
        }

        undo(): void {
            //
        }

        redo(): void {
            //
        }
    }
}