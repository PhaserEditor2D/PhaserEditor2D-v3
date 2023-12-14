/// <reference path="../../sceneobjects/object/properties/SceneGameObjectSection.ts" />
namespace phasereditor2d.scene.ui.editor.properties {

    import controls = colibri.ui.controls;
    import io = colibri.core.io;

    export class DynamicUserComponentSection extends sceneobjects.SceneGameObjectSection<sceneobjects.ISceneGameObject> {

        private _componentName: string;
        private _componentDisplayName: string;

        constructor(page: controls.properties.PropertyPage, componentName: string, componentDisplayName: string, hash: string) {
            super(page,
                DynamicUserComponentSection.computeId(componentName, hash),
                componentName, false, true,
                resources.getIcon(resources.ICON_USER_COMPONENT),
                `DynamicUserComponentSection_${componentName}}`);

            this._componentName = componentName;
            this._componentDisplayName = componentDisplayName;
        }

        private static computeId(compName: string, hash: string) {

            return `phasereditor2d.scene.ui.editor.properties.DynamicPropertySection_${compName}_${hash}`;
        }

        isDynamicTitle(): boolean {

            return true;
        }

        getTitle(): string {

            const prefabNames = this.getSelection()
                .flatMap((obj: sceneobjects.ISceneGameObject) => obj.getEditorSupport()
                    .getUserComponentsComponent()
                    .getPrefabUserComponents())
                .filter(i => i.components.find(c => c.getName() === this._componentName))
                .map(i => sceneobjects.getSceneDisplayName(i.prefabFile));

            const distinctPrefabNames: string[] = [];

            if (prefabNames.length > 0) {

                const used = new Set();

                for (const prefabName of prefabNames) {

                    if (used.has(prefabName)) {

                        continue;
                    }

                    used.add(prefabName);
                    distinctPrefabNames.push(prefabName);
                }

                return `${this._componentDisplayName} <span class="UserComponentTitle_PrefabsPart">← ${distinctPrefabNames.join(" &amp; ")}</span>`;
            }

            return this._componentDisplayName;
        }

        createMenu(menu: controls.Menu): void {

            const obj = this.getSelectionFirstElement();
            const objES = obj.getEditorSupport();

            menu.addAction({
                text: `Select Objects With ${this._componentDisplayName}`,
                callback: () => {

                    const sel = [];

                    this.getEditor().getScene().visitAll(obj => {

                        if (sceneobjects.GameObjectEditorSupport.hasObjectComponent(obj, sceneobjects.UserComponentsEditorComponent)) {

                            const userComp = sceneobjects.GameObjectEditorSupport
                                .getObjectComponent(obj, sceneobjects.UserComponentsEditorComponent) as sceneobjects.UserComponentsEditorComponent;

                            if (userComp.hasUserComponent(this._componentName)) {

                                sel.push(obj);
                            }
                        }
                    });

                    this.getEditor().setSelection(sel);
                }
            });

            menu.addAction({
                text: "Open Definition Of " + this._componentDisplayName,
                callback: () => this.openComponentEditor()
            });

            // the Reveal In Prefab File options
            {

                const prefabFiles: io.FilePath[] = [];

                for (const obj of this.getSelection()) {

                    const objES = obj.getEditorSupport();

                    if (objES.isPrefabInstance()) {

                        const file = objES.getPrefabFile();

                        if (prefabFiles.indexOf(file) < 0) {

                            prefabFiles.push(file);
                        }
                    }
                }

                for (const prefabFile of prefabFiles) {

                    menu.addAction({
                        text: `Reveal In ${sceneobjects.getSceneDisplayName(prefabFile)} File`,
                        callback: () => this.openPrefabDefInSceneEditor(prefabFile)
                    });
                }
            }

            const allLocalNodes = this.getSelection()
                .filter(obj => obj.getEditorSupport()
                    .getUserComponentsComponent()
                    .hasLocalUserComponent(this._componentName))
                .length === this.getSelection().length;

            if (allLocalNodes) {

                if (this.getSelection().length === 1) {

                    const editorComp = objES.getUserComponentsComponent();

                    menu.addAction({
                        text: "Move Up",
                        callback: () => {

                            this.runOperation(() => {

                                editorComp.moveUpUserComponent(this._componentName)
                            });

                            this.updateWithSelection();
                        }
                    });

                    menu.addAction({
                        text: "Move Down",
                        callback: () => {

                            this.runOperation(() => {

                                editorComp.moveDownUserComponent(this._componentName)
                            });

                            this.updateWithSelection();
                        }
                    });
                }


                menu.addAction({
                    text: "Delete",
                    callback: () => {

                        const editor = this.getEditor();

                        const selIds = editor.getSelectionManager().getSelectionIds();

                        this.runOperation(() => {

                            for (const obj of this.getSelection()) {

                                const objEs = obj.getEditorSupport();
                                objEs.getUserComponentsComponent()
                                    .removeUserComponent(this._componentName);
                            }
                        });

                        editor.getSelectionManager().setSelectionByIds(selIds);
                    }
                });
            }
        }

        private runOperation(action: () => void) {

            const editor = this.getEditor();

            editor.getUndoManager().add(new ui.editor.undo.SimpleSceneSnapshotOperation(editor, action));
        }

        private openPrefabDefInSceneEditor(prefabFile: io.FilePath) {

            const prefabEditor = colibri.Platform.getWorkbench().openEditor(prefabFile);

            if (prefabEditor && prefabEditor instanceof ui.editor.SceneEditor) {

                setTimeout(() => {

                    const obj = this.getSelectionFirstElement();
                    const objES = obj.getEditorSupport();

                    let selObj: sceneobjects.ISceneGameObject;

                    if (objES.isNestedPrefabInstance()) {

                        selObj = prefabEditor.getScene().getByEditorId(objES.getPrefabId());

                    } else {

                        selObj = prefabEditor.getScene().getPrefabObject();
                    }

                    if (selObj) {

                        prefabEditor.setSelection([selObj]);
                    }

                }, 10);
            }
        }

        private openComponentEditor() {

            const finder = ScenePlugin.getInstance().getSceneFinder();

            const info = finder.getUserComponentByName(this._componentName);

            const editor = colibri.Platform.getWorkbench().openEditor(info.file) as editor.usercomponent.UserComponentsEditor;

            editor.revealComponent(this._componentName);
        }

        createForm(parent: HTMLDivElement) {

            const comp = this.createGridElement(parent);
            comp.style.gridTemplateColumns = "auto auto 1fr";

            {
                // export property

                const result = this.createBooleanField(comp, this.getExportProperty(), false);
                result.labelElement.style.gridColumn = "2";

                this.addUpdater(() => {

                    const scene = this.getEditor().getScene();

                    const values = this.getSelection().map(obj => {

                        const objES = obj.getEditorSupport();

                        if (scene.isPrefabSceneType()
                            && (objES.isScenePrefabObject() || objES.isNestedPrefabScope())) {

                            if (objES.getUserComponentsComponent()
                                .hasLocalUserComponent(this._componentName)) {

                                return true;
                            }
                        }

                        return false;
                    })

                    const visible = this.flatValues_BooleanAnd(values);

                    result.labelElement.style.display = visible ? "" : "none";
                    result.checkElement.style.display = visible ? "" : "none";
                });
            }

            // user properties

            const finder = ScenePlugin.getInstance().getSceneFinder();

            const compInfo = finder.getUserComponentByName(this._componentName);

            {
                const props = compInfo.component.getUserProperties().getProperties();

                if (props.length > 0) {

                    const atLeastOnePrefab = this.getSelection()
                        .map(obj => obj.getEditorSupport())
                        .filter(objES => objES.isPrefabInstance()
                            && !objES.getUserComponentsComponent()
                                .hasLocalUserComponent(this._componentName))
                        .length > 0;

                    for (const prop of props) {

                        prop.getType().createInspectorPropertyEditor(this, comp, prop, atLeastOnePrefab);
                    }
                }
            }
        }

        private getExportProperty(): sceneobjects.IProperty<sceneobjects.ISceneGameObject> {

            return {
                name: "isExported",
                label: "Export",
                getValue: obj => {

                    const value = obj.getEditorSupport()
                        .getUserComponentsComponent().isExportComponent(this._componentName);

                    return value;
                },
                setValue: (obj: sceneobjects.ISceneGameObject, value: boolean) => {

                    const compName = this._componentName;

                    obj.getEditorSupport()
                        .getUserComponentsComponent()
                        .setExportComponent(compName, value);
                },
                defValue: true,
            };
        }

        canEdit(obj: any, n: number): boolean {

            if (sceneobjects.isGameObject(obj)) {

                const objES = sceneobjects.GameObjectEditorSupport.getEditorSupport(obj);

                const userComp = objES.getUserComponentsComponent();

                if (userComp.hasUserComponent(this._componentName)) {

                    if (userComp.hasLocalUserComponent(this._componentName)) {

                        return true;
                    }

                    const exported = userComp.isComponentPublished(this._componentName);

                    return exported;
                }
            }

            return false;
        }

        canEditNumber(n: number): boolean {

            return n > 0;
        }

    }
}