namespace phasereditor2d.scene.ui.sceneobjects {

    import controls = colibri.ui.controls;

    export class PrefabInstanceSection extends SceneGameObjectSection<ISceneGameObject> {

        private _propArea: HTMLDivElement;

        constructor(page: controls.properties.PropertyPage) {
            super(page,
                "phasereditor2d.scene.ui.sceneobjects.PrefabInstanceUserPropertySection", "Prefab Instance");
        }

        getSectionHelpPath() {

            return "scene-editor/prefab-user-properties.html#user-properties-in-a-prefab-instance";
        }

        createMenu(menu: controls.Menu) {

            menu.addCommand(editor.commands.CMD_OPEN_PREFAB);

            menu.addSeparator();

            super.createMenu(menu);
        }

        createForm(parent: HTMLDivElement) {

            const comp = this.createGridElement(parent);
            comp.style.gridTemplateColumns = "1fr";

            this._propArea = this.createGridElement(comp);
            this._propArea.style.gridTemplateColumns = "auto auto 1fr";

            comp.appendChild(this._propArea);

            this.addUpdater(() => {

                this._propArea.innerHTML = "";

                const obj = this.getSelectionFirstElement() as ISceneGameObject;

                const userPropsComponent = GameObjectEditorSupport
                    .getObjectComponent(obj, PrefabUserPropertyComponent) as PrefabUserPropertyComponent;

                const propsByPrefabList = userPropsComponent.getPropertiesByPrefab();

                for (const propsByPrefab of propsByPrefabList) {

                    const prefabFile = propsByPrefab.prefabFile;
                    const prefabName = prefabFile.getNameWithoutExtension();

                    const headerDiv = document.createElement("div");
                    headerDiv.classList.add("PrefabLink");
                    headerDiv.style.gridColumn = "1 / span 3";
                    headerDiv.style.width = "100%";
                    this._propArea.appendChild(headerDiv);

                    const prefabBtn = document.createElement("a");
                    prefabBtn.href = "#";
                    prefabBtn.innerHTML = prefabName;
                    headerDiv.appendChild(prefabBtn);

                    const openFileCallback = () => colibri.Platform.getWorkbench().openEditor(propsByPrefab.prefabFile);

                    prefabBtn.addEventListener("click", openFileCallback);

                    this.createMenuIcon(headerDiv, () => {

                        const menu = new controls.Menu();

                        menu.addAction({
                            text: `Select All ${prefabName}`,
                            callback: () => {

                                const finder = ScenePlugin.getInstance().getSceneFinder();

                                const sel = [];

                                this.getEditor().getScene().visit(obj2 => {

                                    if (GameObjectEditorSupport.hasEditorSupport(obj2)) {

                                        const editorSupport = GameObjectEditorSupport.getEditorSupport(obj2);

                                        if (editorSupport.isPrefabInstance()) {

                                            const prefabFiles = finder.getPrefabHierarchy(editorSupport.getPrefabId());

                                            if (prefabFiles.indexOf(prefabFile) >= 0) {

                                                sel.push(obj2);
                                            }
                                        }
                                    }
                                });

                                this.getEditor().setSelection(sel);
                            }
                        });

                        menu.addAction({
                            text: `Open ${prefabName} File`,
                            callback: openFileCallback
                        })

                        return menu;
                    });

                    for (const prop of propsByPrefab.properties) {

                        prop.getType().createInspectorPropertyEditor(this, this._propArea, prop, true);
                    }
                }
            });
        }

        canEdit(obj: any, n: number): boolean {

            return true;
        }

        canEditNumber(n: number): boolean {

            if (n === 0) {

                return false;
            }

            const obj = this.getSelectionFirstElement();

            if (GameObjectEditorSupport.hasEditorSupport(obj)) {

                const support = GameObjectEditorSupport.getEditorSupport(obj);

                if (support.isPrefabInstance()) {

                    const prefabFile = support.getPrefabFile();

                    for (const obj2 of this.getSelection()) {

                        if (GameObjectEditorSupport.hasEditorSupport(obj2)) {

                            const support2 = GameObjectEditorSupport.getEditorSupport(obj2);

                            if (support2.isPrefabInstance()) {

                                const prefabFile2 = support2.getPrefabFile();

                                if (prefabFile !== prefabFile2) {

                                    return false;
                                }

                            } else {

                                return false;
                            }

                        } else {

                            return false;
                        }
                    }

                    return true;
                }
            }


            return false;
        }
    }
}