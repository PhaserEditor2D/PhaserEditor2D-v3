/// <reference path="../object/SceneGameObjectOperation.ts"/>

namespace phasereditor2d.scene.ui.sceneobjects {

    export class EnableHitAreaOperation extends SceneGameObjectOperation<ISceneGameObject> {

        constructor(editor: ui.editor.SceneEditor, enable: boolean) {
            super(editor, editor.getSelectedGameObjects(), enable);
        }

        getValue(obj: ISceneGameObject) {

            return obj.getEditorSupport().hasComponent(HitAreaComponent);
        }

        setValue(obj: ISceneGameObject, enable: boolean): void {

            HitAreaComponent.enableHitArea(obj, enable);
        }
    }
}