namespace phasereditor2d.scene.ui.editor.outline {

    import controls = colibri.ui.controls;

    export class SceneEditorOutlineLabelProvider implements controls.viewers.ILabelProvider {

        getLabel(obj: any): string {

            if (obj instanceof Phaser.GameObjects.GameObject) {

                const support = (obj as sceneobjects.ISceneObject).getEditorSupport();

                if (support.getScene().isPrefabSceneType() && obj === support.getScene().getPrefabObject()) {

                    return `[Prefab Object: ${support.isPrefabInstance() ? support.getPrefabName() : support.getObjectType()}]`;
                }

                return support.getLabel();

            } else if (obj instanceof Phaser.GameObjects.DisplayList) {

                return "Display List";

            } else if (obj instanceof sceneobjects.ObjectLists) {

                return "Lists";

            } else if (obj instanceof sceneobjects.ObjectList) {

                return obj.getLabel();
            }

            return "" + obj;
        }
    }
}