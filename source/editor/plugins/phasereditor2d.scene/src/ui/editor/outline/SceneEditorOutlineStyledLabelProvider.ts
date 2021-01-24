namespace phasereditor2d.scene.ui.editor.outline {

    import controls = colibri.ui.controls;

    export class SceneEditorOutlineStyledLabelProvider implements controls.viewers.IStyledLabelProvider {

        getLabel(obj: any): string {

            if (sceneobjects.ScenePlainObjectEditorSupport.hasEditorSupport(obj)) {

                const plainObject = obj as sceneobjects.IScenePlainObject;

                return plainObject.getEditorSupport().getLabel();

            } if (sceneobjects.isGameObject(obj)) {

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

        getStyledTexts(obj: any, dark: boolean): controls.viewers.IStyledText[] {

            const theme = controls.Controls.getTheme();

            const baseLabel = this.getLabel(obj);

            if (sceneobjects.GameObjectEditorSupport.hasObjectComponent(obj, sceneobjects.VisibleComponent)) {

                const visible = sceneobjects.VisibleComponent.visible.getValue(obj);

                if (!visible) {

                    return [
                        {
                            text: baseLabel,
                            color: theme.viewerForeground
                        },
                        {
                            text: " (hidden)",
                            color: theme.viewerForeground + "90"
                        }
                    ];
                }
            }

            return [{
                text: baseLabel,
                color: theme.viewerForeground
            }];
        }
    }
}