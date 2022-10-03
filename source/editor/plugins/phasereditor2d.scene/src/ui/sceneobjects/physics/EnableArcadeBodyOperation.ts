namespace phasereditor2d.scene.ui.sceneobjects {

    export class EnableArcadeBodyOperation extends SceneGameObjectOperation<ISceneGameObject> {

        constructor(editor: ui.editor.SceneEditor, enable: boolean) {
            super(editor, editor.getSelectedGameObjects(), enable);
        }

        getValue(obj: ISceneGameObject) {

            return obj.getEditorSupport().hasComponent(ArcadeComponent);
        }

        setValue(obj: ISceneGameObject, enable: boolean): void {

            if (enable) {

                ArcadeComponent.enableBody(obj);

            } else {

                ArcadeComponent.disableBody(obj);
            }
        }
    }
}