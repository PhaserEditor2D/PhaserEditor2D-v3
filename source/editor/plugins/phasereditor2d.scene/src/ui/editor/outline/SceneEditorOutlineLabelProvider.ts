namespace phasereditor2d.scene.ui.editor.outline {

    import controls = colibri.ui.controls;

    export class SceneEditorOutlineLabelProvider implements controls.viewers.ILabelProvider {

        getLabel(obj: any): string {

            if (sceneobjects.ScenePlainObjectEditorSupport.hasEditorSupport(obj)) {

                const plainObject = obj as sceneobjects.IScenePlainObject;

                return plainObject.getEditorSupport().getLabel();

            } if (obj instanceof Phaser.GameObjects.GameObject) {

                const support = (obj as sceneobjects.ISceneGameObject).getEditorSupport();

                if (support.getScene().isPrefabSceneType() && obj === support.getScene().getPrefabObject()) {

                    const file = support.getScene().getEditor().getInput();

                    return `${file.getNameWithoutExtension()} (Prefab Object: ${support.isPrefabInstance() ? support.getPrefabName() : support.getObjectType()})`;
                }

                return support.getLabel();

            } else if (obj instanceof Phaser.GameObjects.DisplayList) {

                return "Display List";

            } else if (obj instanceof sceneobjects.ObjectLists) {

                return "Lists";

            } else if (obj instanceof sceneobjects.ObjectList) {

                return obj.getLabel();
            }

            const extensions = ScenePlugin.getInstance().getSceneEditorOutlineExtensions();

            for (const ext of extensions) {

                if (ext.isLabelProviderFor(obj)) {

                    return ext.getLabelProvider().getLabel(obj);
                }
            }

            return "" + obj;
        }
    }
}