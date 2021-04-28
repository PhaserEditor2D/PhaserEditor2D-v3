namespace phasereditor2d.scene.ui.sceneobjects {

    import controls = colibri.ui.controls;

    export class BaseObjectTool extends editor.tools.SceneTool {

        private _properties: Array<IProperty<any>>;

        constructor(config: editor.tools.ISceneToolConfig, ...properties: Array<IProperty<any>>) {
            super(config);

            this._properties = properties;
        }

        canEdit(obj: unknown): boolean {

            if (sceneobjects.isGameObject(obj)) {

                const support = (obj as unknown as ISceneGameObject).getEditorSupport();

                for (const prop of this._properties) {

                    if (!support.hasProperty(prop)) {
                        return false;
                    }

                    if (!support.isUnlockedProperty(prop)) {
                        return false;
                    }
                }

                return true;
            }

            return false;
        }

        canRender(obj: unknown): boolean {

            if (sceneobjects.isGameObject(obj)) {

                const support = (obj as unknown as ISceneGameObject).getEditorSupport();

                for (const prop of this._properties) {

                    if (support.hasProperty(prop)) {
                        return true;
                    }
                }
            }

            return false;
        }

        confirmUnlockProperty(props: Array<IProperty<any>>, propLabel: string, sectionId: string, args: editor.tools.ISceneToolContextArgs) {

            const lockedObjects = args.objects.filter(obj => {

                for (const prop of props) {

                    if (!obj.getEditorSupport().isUnlockedProperty(prop)) {

                        return true;
                    }

                    return false;
                }
            });

            if (lockedObjects.length > 0) {

                controls.dialogs.ConfirmDialog.show(
                    `The ${propLabel} property is locked in ${lockedObjects.length} objects. Do you want to unlock it?`, "Unlock")
                    .then(ok => {

                        if (ok) {

                            args.editor.getUndoManager()
                                .add(new PropertyUnlockOperation(args.editor, args.objects, props, true));

                            args.editor.updateInspectorViewSection(sectionId);
                        }
                    });
            }
        }
    }
}