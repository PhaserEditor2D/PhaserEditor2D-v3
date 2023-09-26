namespace phasereditor2d.scene.ui.sceneobjects {

    import controls = colibri.ui.controls;

    export class SpineSection extends SceneGameObjectSection<SpineObject> {

        constructor(page: controls.properties.PropertyPage) {
            super(page, "phasereditor2d.scene.ui.sceneobjects.SpineSection", "Spine");
        }

        protected getSectionHelpPath() {
            
            return "scene-editor/spine-animations-game-object-properties.html";
        }

        createForm(parent: HTMLDivElement): void {

            const comp = this.createGridElement(parent, 3);

            this.createPropertyStringRow(comp, SpineComponent.dataKey, false, true);

            this.createPropertyStringRow(comp, SpineComponent.atlasKey, false, true);

            this.createPropertyEnumRow(comp, SpineComponent.skin);

            this.createConfigureButton(comp);
        }

        private createConfigureButton(comp: HTMLDivElement) {

            const elem = document.createElement("hr");
            elem.style.gridColumn = "1 / span 3";
            elem.style.width = "100%";
            elem.style.opacity = "0.25";
            comp.appendChild(elem);

            {
                // Configure

                const btn = this.createButton(comp, "Configure", async () => {

                    const finder = new pack.core.PackFinder();

                    await finder.preload();

                    const dlg = new SpineConfigWizard(finder);

                    dlg.setFinishCallback(async () => {

                        const { dataAsset, atlasAsset, skinName } = dlg.getSelection();

                        const editor = this.getEditor();

                        editor.getUndoManager().add(
                            new ConfigureObjectOperation(
                                editor, dataAsset.getKey(), atlasAsset.getKey(), skinName));
                    });

                    dlg.create();
                });

                btn.style.gridColumn = "1 / span 3";

                this.addUpdater(() => {

                    let disabled = false;

                    for (const obj of this.getSelection()) {

                        if (obj.getEditorSupport().isPrefabInstance()) {

                            disabled = true;
                            break;
                        }
                    }

                    btn.disabled = disabled;
                });
            }

            {
                // Preview
                const btn = this.createButton(comp, "Preview", () => {

                    const dlg = new SpineGameObjectPreviewDialog(this.getSelectionFirstElement());

                    dlg.create();
                });

                btn.style.gridColumn = "1 / span 3";
            }
        }

        createMenu(menu: controls.Menu): void {

            menu.addCommand(ui.editor.commands.CMD_SELECT_ALL_OBJECTS_SAME_SPINE_SKELETON);
            menu.addCommand(ui.editor.commands.CMD_SELECT_ALL_OBJECTS_SAME_SPINE_SKIN);

            super.createMenu(menu);
        }

        canEditAll(selection: SpineObject[]): boolean {

            const first = selection[0];

            const { dataKey } = first;

            for (const obj of selection) {

                if (obj.dataKey !== dataKey) {

                    return false;
                }
            }

            return true;
        }

        canEdit(obj: any, n: number): boolean {

            return obj instanceof SpineObject;
        }

        canEditNumber(n: number): boolean {

            return n > 0;
        }
    }

    class ConfigureObjectOperation extends editor.undo.ObjectSnapshotOperation {

        constructor(
            editor: ui.editor.SceneEditor,
            private dataKey: string,
            private atlasKey: string,
            private skinName: string) {

            super(editor, editor.getSelectedGameObjects());
        }

        protected makeChangeSnapshot(input: ISceneGameObject[]): editor.undo.ISnapshot {

            const result: editor.undo.ISnapshot = {
                objects: []
            };

            for (const obj of input) {

                const objData: core.json.IObjectData = {} as any;

                obj.getEditorSupport().writeJSON(objData);

                objData[SpineComponent.dataKey.name] = this.dataKey;
                objData[SpineComponent.atlasKey.name] = this.atlasKey;
                objData[SpineComponent.skin.name] = this.skinName;

                const parentId = obj.getEditorSupport().getParentId();

                result.objects.push({
                    objData,
                    parentId
                });
            }

            return result;
        }
    }
}