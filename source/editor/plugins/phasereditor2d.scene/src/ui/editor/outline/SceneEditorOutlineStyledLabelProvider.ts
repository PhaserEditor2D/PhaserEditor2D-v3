namespace phasereditor2d.scene.ui.editor.outline {

    import controls = colibri.ui.controls;

    export class SceneEditorOutlineStyledLabelProvider implements controls.viewers.IStyledLabelProvider {

        getLabel(obj: any): string {

            if (sceneobjects.ScenePlainObjectEditorSupport.hasEditorSupport(obj)) {

                const plainObject = obj as sceneobjects.IScenePlainObject;

                return plainObject.getEditorSupport().getLabel();

            } else if (sceneobjects.isGameObject(obj)) {

                const objES = (obj as sceneobjects.ISceneGameObject).getEditorSupport();

                if (objES.getScene().isPrefabSceneType() && obj === objES.getScene().getPrefabObject()) {

                    const file = objES.getScene().getEditor().getInput();

                    return `${file.getNameWithoutExtension()} (Prefab Object: ${objES.isPrefabInstance() ? objES.getPrefabName() : objES.getObjectType()})`;
                }

                let label = sceneobjects.formatObjectDisplayText(obj);

                return label;

            } else if (obj instanceof Phaser.GameObjects.DisplayList) {

                return "Scene";

            } else if (obj instanceof sceneobjects.ObjectLists) {

                return "Lists";

            } else if (obj instanceof sceneobjects.ObjectList) {

                return obj.getLabel();

            } else if (obj instanceof sceneobjects.ObjectListItem) {

                return this.getLabel(obj.getObject());

            } else if (obj instanceof sceneobjects.UserComponentNode) {

                return obj.getUserComponent().getDisplayNameOrName();

            } else if (obj instanceof sceneobjects.PrefabUserProperties) {

                return "Prefab Properties";

            } else if (obj instanceof sceneobjects.UserProperty) {

                return obj.getLabel();

            } else if (obj instanceof codesnippets.CodeSnippets) {

                return "Code Snippets";

            } else if (obj instanceof codesnippets.CodeSnippet) {

                return obj.getDisplayName();
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

            let color = theme.viewerForeground;

            const baseLabel = this.getLabel(obj);

            let hintText = "";

            if (obj instanceof sceneobjects.UserComponentNode) {

                if (obj.isPrefabDefined()) {

                    hintText += ` (comp ← ${obj.getPrefabFile().getNameWithoutExtension()})`;

                    if (obj.getObject().getEditorSupport().isMutableNestedPrefabInstance()) {

                        color = ScenePlugin.getInstance().getNestedPrefabColor();

                    } else {

                        color = ScenePlugin.getInstance().getPrefabColor();
                    }

                } else {

                    hintText += " (comp)";
                }
            }

            if (sceneobjects.isGameObject(obj) && sceneobjects.findObjectDisplayFormat(obj)) {

                const objES = (obj as sceneobjects.ISceneGameObject).getEditorSupport();

                hintText += ` (${objES.getLabel()})`;
            }

            if (sceneobjects.GameObjectEditorSupport.hasObjectComponent(obj, sceneobjects.VisibleComponent)) {

                const visible = sceneobjects.VisibleComponent.visible.getValue(obj);

                if (!visible) {

                    hintText += "(hidden)";
                }
            }

            if (sceneobjects.isGameObject(obj)) {

                const objES = (obj as sceneobjects.ISceneGameObject).getEditorSupport();

                if (obj instanceof sceneobjects.FXObject) {

                    hintText += " #" + (obj.isPreFX ? "preFX" : "postFX");
                }

                if (obj instanceof sceneobjects.ScriptNode) {

                    hintText += " #script";
                }

                if (objES.isMutableNestedPrefabInstance()) {

                    hintText += " #nested_prefab_inst";

                    color = ScenePlugin.getInstance().getNestedPrefabColor();

                } else if (objES.isPrefabInstance()) {

                    hintText += " #prefab_inst"

                    color = ScenePlugin.getInstance().getPrefabColor();
                }

                if (!objES.isNestedPrefabInstance()) {

                    hintText += ` #scope_${objES.getScope().toLocaleLowerCase()}`;
                }
            }

            if (hintText === "") {

                return [
                    {
                        text: baseLabel,
                        color: theme.viewerForeground
                    }];
            }

            return [
                {
                    text: baseLabel,
                    color
                },
                {
                    text: " " + hintText,
                    color: theme.viewerForeground + "45"
                }
            ];
        }
    }
}