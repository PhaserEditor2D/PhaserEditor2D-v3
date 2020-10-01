namespace phasereditor2d.scene.ui.sceneobjects {

    import controls = colibri.ui.controls;

    export class UserComponentInstancePropertySection extends SceneGameObjectSection<ISceneGameObject> {

        private _propArea: HTMLDivElement;

        constructor(page: controls.properties.PropertyPage) {
            super(page,
                "phasereditor2d.scene.ui.sceneobjects.UserComponentInstancePropertySection", "User Components", false, true);
        }

        getSectionHelpPath() {
            return "scene-editor/user-components-instancing.html";
        }

        private getCommonComponents(getComponents: (c: UserComponentsEditorComponent) => string[]) {

            const nameCountMap = new Map<string, number>();

            for (const obj of this.getSelection()) {

                const editorComp = EditorSupport.getObjectComponent(obj, UserComponentsEditorComponent) as UserComponentsEditorComponent;

                const result = getComponents(editorComp);

                for (const name of result) {

                    if (nameCountMap.has(name)) {

                        const count = nameCountMap.get(name);
                        nameCountMap.set(name, count + 1);

                    } else {

                        nameCountMap.set(name, 1);
                    }
                }
            }

            const total = this.getSelection().length;

            const names = [...nameCountMap.keys()];

            return names

                .filter(name => nameCountMap.get(name) === total);
        }

        createForm(parent: HTMLDivElement) {

            const comp = this.createGridElement(parent);
            comp.style.gridTemplateColumns = "1fr";

            this._propArea = this.createGridElement(comp);
            this._propArea.style.gridTemplateColumns = "1fr";

            comp.appendChild(this._propArea);

            this.addUpdater(() => {

                this._propArea.innerHTML = "";

                const finder = ScenePlugin.getInstance().getSceneFinder();

                const editorCompList = this.getSelection()
                    .map(obj => EditorSupport.getObjectComponent(obj, UserComponentsEditorComponent) as UserComponentsEditorComponent);

                const commonLocalComponents = this.getCommonComponents(c => c.getUserComponents().map(info => info.component.getName()));

                for (const compName of commonLocalComponents) {

                    const compInfo = finder.getUserComponentByName(compName);

                    const headerDiv = document.createElement("div");
                    headerDiv.classList.add("PrefabLink");
                    headerDiv.style.width = "100%";

                    this._propArea.appendChild(headerDiv);

                    const compBtn = document.createElement("a");
                    headerDiv.appendChild(compBtn);
                    compBtn.href = "#";
                    compBtn.innerHTML = compName;
                    compBtn.addEventListener("click", e => {

                        const info = finder.getUserComponentByName(compName);

                        const editor = colibri.Platform.getWorkbench().openEditor(info.file) as ui.editor.usercomponent.UserComponentsEditor;

                        editor.revealComponent(compName);

                        colibri.Platform.getWorkbench().openEditor(compInfo.file);
                    });

                    this.createComponentMenuIcon(headerDiv, editorCompList, compName, true);

                    {
                        const props = compInfo.component.getUserProperties().getProperties();

                        if (props.length > 0) {

                            const compPropArea = this.createGridElement(this._propArea);
                            compPropArea.style.gridTemplateColumns = "auto auto 1fr";
                            compPropArea.style.width = "100%";

                            for (const prop of props) {

                                prop.getType().createInspectorPropertyEditor(this, compPropArea, prop, false);
                            }
                        }
                    }
                }

                // prefab components

                const commonPrefabComponents = new Set(this.getCommonComponents(
                    c => c.getPrefabUserComponents()

                        .flatMap(info => info.components)

                        .flatMap(comp2 => comp2.getName())));


                for (const editorComp of editorCompList) {

                    const result = editorComp.getPrefabUserComponents();

                    for (const compInfo of result) {

                        for (const userComp of compInfo.components) {

                            if (commonPrefabComponents.has(userComp.getName())) {

                                commonPrefabComponents.delete(userComp.getName());

                            } else {

                                continue;
                            }

                            const headerDiv = document.createElement("div");
                            headerDiv.classList.add("PrefabLink");
                            headerDiv.style.width = "100%";

                            this._propArea.appendChild(headerDiv);

                            // open prefab file
                            const prefabBtn = document.createElement("a");
                            headerDiv.appendChild(prefabBtn);
                            prefabBtn.href = "#";
                            prefabBtn.innerHTML = compInfo.prefabFile.getNameWithoutExtension();
                            prefabBtn.addEventListener("click", e => {

                                colibri.Platform.getWorkbench().openEditor(compInfo.prefabFile);
                            });

                            const elem = document.createElement("label");
                            elem.innerHTML = " &rsaquo; ";
                            headerDiv.appendChild(elem);

                            // open components file
                            const compBtn = document.createElement("a");
                            headerDiv.appendChild(compBtn);
                            compBtn.href = "#";
                            compBtn.innerHTML = userComp.getName();
                            compBtn.addEventListener("click", e => {

                                const info = finder.getUserComponentByName(userComp.getName());

                                const editor = colibri.Platform.getWorkbench().openEditor(info.file) as ui.editor.usercomponent.UserComponentsEditor;

                                editor.revealComponent(userComp.getName());
                            });

                            this.createComponentMenuIcon(headerDiv, editorCompList, userComp.getName(), false);

                            {
                                const props = userComp.getUserProperties().getProperties();

                                if (props.length > 0) {

                                    const compPropArea = this.createGridElement(this._propArea);
                                    compPropArea.style.gridTemplateColumns = "auto auto 1fr";
                                    compPropArea.style.width = "100%";

                                    for (const prop of props) {

                                        prop.getType().createInspectorPropertyEditor(this, compPropArea, prop, true);
                                    }
                                }
                            }
                        }
                    }
                }

                // Add Components button

                const used = new Set(
                    [...editorCompList
                        .flatMap(editorComp => editorComp.getUserComponents())
                        .map(info => info.component.getName()),

                    ...editorCompList.flatMap(editorComp => editorComp.getPrefabUserComponents())
                        .flatMap(info => info.components)
                        .map(c => c.getName())
                    ]
                );

                const items = finder.getUserComponentsModels()

                    .flatMap(info => info.model.getComponents())

                    .filter(c => !used.has(c.getName()))

                    .map(c => ({
                        name: c.getName(),
                        value: c.getName(),
                        icon: ScenePlugin.getInstance().getIcon(ICON_USER_COMPONENT)
                    }));

                const btn = this.createMenuButton(this._propArea, "Add Component", items, (value: string) => {

                    const compInfo = finder.getUserComponentByName(value);

                    if (compInfo) {

                        this.runOperation(() => {

                            for (const editorComp of editorCompList) {

                                editorComp.addUserComponent(value);
                            }
                        });

                        this.updateWithSelection();
                    }
                });
                btn.style.width = "100%";
                btn.style.justifySelf = "self-center";
                btn.style.marginTop = "10px";
                btn.disabled = items.length === 0;
            });
        }

        private createComponentMenuIcon(
            headerDiv: HTMLElement, editorCompList: UserComponentsEditorComponent[], compName: string, localComponent: boolean) {

            this.createMenuIcon(headerDiv, () => {

                const menu = new controls.Menu();

                menu.addAction({
                    text: `Select All With ${compName}`,
                    callback: () => {

                        const sel = [];

                        this.getEditor().getScene().visit(obj => {


                            if (EditorSupport.hasObjectComponent(obj, UserComponentsEditorComponent)) {

                                const userComp = EditorSupport
                                    .getObjectComponent(obj, UserComponentsEditorComponent) as UserComponentsEditorComponent;

                                if (userComp.hasUserComponent(compName)) {

                                    sel.push(obj);
                                }
                            }
                        });

                        this.getEditor().setSelection(sel);
                    }
                });

                if (localComponent) {

                    if (editorCompList.length === 1) {

                        menu.addAction({
                            text: "Move Up",
                            callback: () => {

                                this.runOperation(() => {

                                    const editorComp = editorCompList[0];
                                    editorComp.moveUpUserComponent(compName)
                                });

                                this.updateWithSelection();
                            }
                        });

                        menu.addAction({
                            text: "Move Down",
                            callback: () => {

                                this.runOperation(() => {

                                    const editorComp = editorCompList[0];
                                    editorComp.moveDownUserComponent(compName)
                                });

                                this.updateWithSelection();
                            }
                        });
                    }

                    menu.addAction({
                        text: "Delete",
                        callback: () => {

                            this.runOperation(() => {

                                for (const editorComp of editorCompList) {

                                    editorComp.removeUserComponent(compName);
                                }
                            });

                            this.updateWithSelection();
                        }
                    });
                }

                return menu;
            });
        }

        private runOperation(action: () => void) {

            const editor = this.getEditor();

            editor.getUndoManager().add(new ui.editor.undo.SimpleSceneSnapshotOperation(editor, action));
        }

        canEdit(obj: any, n: number): boolean {

            return EditorSupport.hasEditorSupport(obj);
        }

        canEditNumber(n: number): boolean {

            return n > 0;
        }
    }
}