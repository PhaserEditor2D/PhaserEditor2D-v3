namespace phasereditor2d.scene.ui.sceneobjects {

    import controls = colibri.ui.controls;
    import io = colibri.core.io;

    class GameObjectSectionAdapter extends SceneGameObjectSection<ISceneGameObject> {

        constructor(page: controls.properties.PropertyPage) {
            super(page, "id", "title");
        }

        createForm(parent: HTMLDivElement) {
            // nothing
        }

        canEdit(obj: any, n: number): boolean {
            // nothing
            return false;
        }

        canEditNumber(n: number): boolean {
            // nothing
            return false;
        }

        getSelection(): ISceneGameObject[] {

            const page = this.getPage();

            const sel = page.getSelection();

            return sel.map((n: UserComponentNode) => n.getObject());
        }
    }

    export class ObjectSingleUserComponentSection extends editor.properties.BaseSceneSection<UserComponentNode> {

        private _propArea: HTMLDivElement;

        constructor(page: controls.properties.PropertyPage) {
            super(page,
                "phasereditor2d.scene.ui.sceneobjects.ObjectSingleUserComponentSection", "User Component", false, false);
        }

        getSectionHelpPath() {
            return "scene-editor/user-components-instancing.html";
        }

        createForm(parent: HTMLDivElement) {

            const sectionAdapter = new GameObjectSectionAdapter(this.getPage());

            {
                const commonPropsComp = this.createGridElement(parent, 2);

                {
                    // name property

                    this.createLabel(commonPropsComp, "Component");

                    const text = this.createText(commonPropsComp, true);

                    this.addUpdater(() => {

                        text.value = this.buildComponentName();
                    });
                }

                {
                    // export property

                    const result = sectionAdapter.createBooleanField(commonPropsComp, this.getExportProperty(), false);

                    this.addUpdater(() => {

                        const values = this.getSelection().map(n => {

                            if (n.getObject().getEditorSupport().isScenePrefabObject()) {

                                if (n.getUserComponentsComponent().hasLocalUserComponent(n.getComponentName())) {

                                    return true;
                                }
                            }

                            return false;
                        });

                        const visible = this.flatValues_BooleanAnd(values);

                        result.labelElement.style.display = visible ? "" : "none";
                        result.checkElement.style.display = visible ? "" : "none";
                    });
                }
            }

            this._propArea = this.createGridElement(parent);
            this._propArea.style.gridTemplateColumns = "1fr";

            this.addUpdater(() => {

                this._propArea.innerHTML = "";

                const finder = ScenePlugin.getInstance().getSceneFinder();

                const nodes = this.getSelection();
                const node = nodes[0];

                const compName = node.getComponentName();
                const compInfo = finder.getUserComponentByName(compName);

                // properties

                {
                    const props = compInfo.component.getUserProperties().getProperties();

                    if (props.length > 0) {

                        const compPropArea = this.createGridElement(this._propArea);
                        compPropArea.style.gridTemplateColumns = "auto auto 1fr";

                        const atLeastOneDefinedInAPrefab = nodes
                            .filter(n => n.isPrefabDefined())
                            .length > 0;

                        for (const prop of props) {

                            prop.getType().createInspectorPropertyEditor(sectionAdapter, compPropArea, prop, atLeastOneDefinedInAPrefab);
                        }
                    }
                }

                const btn = this.createButton(this._propArea, "Select Parent Game Object", () => {

                    this.getEditor().setSelection(this.getSelection().map(node => node.getObject()));
                });
                btn.style.width = "100%";
                btn.style.justifySelf = "self-center";
                btn.style.marginTop = "10px";
            });

            // it is important to update the adapter at the end,
            // because it should update the adapter selection after the dynamic prop elements
            // are created

            this.addUpdater(() => {

                sectionAdapter.updateWithSelection();
            });
        }

        private getExportProperty(): IProperty<ISceneGameObject> {

            return {
                name: "isExported",
                label: "Export",
                getValue: obj => {

                    const compName = this.getSelectionFirstElement().getComponentName();

                    const value = obj.getEditorSupport()
                        .getUserComponentsComponent().isExportComponent(compName);

                    return value;
                },
                setValue: (obj: ISceneGameObject, value: boolean) => {

                    const compName = this.getSelectionFirstElement().getComponentName();

                    obj.getEditorSupport()
                        .getUserComponentsComponent().setExportComponent(compName, value);
                },
                defValue: true,
            };
        }

        private static openComponentEditor(node: UserComponentNode) {

            const finder = ScenePlugin.getInstance().getSceneFinder();

            const compName = node.getComponentName();

            const info = finder.getUserComponentByName(compName);

            const editor = colibri.Platform.getWorkbench().openEditor(info.file) as editor.usercomponent.UserComponentsEditor;

            editor.revealComponent(compName);
        }

        static createComponentIcon(section: colibri.ui.controls.properties.FormBuilder, headerDiv: HTMLDivElement) {

            section.createIcon(headerDiv, ScenePlugin.getInstance().getIcon(ICON_USER_COMPONENT));
        }

        static selectAllComponentNodesFor(editor: ui.editor.SceneEditor, node: UserComponentNode) {

            const compName = node.getComponentName();

            const nodes = editor.getSelectedGameObjects()
                .flatMap(obj => obj.getEditorSupport()
                    .getUserComponentsComponent().getUserComponentNodes())
                .filter(node => node.getComponentName() === compName);

            editor.setSelection(nodes);
        }

        private static openPrefabLinkInSceneEditor(node: UserComponentNode) {

            const prefabFile = node.getPrefabFile();
            const prefabEditor = colibri.Platform.getWorkbench().openEditor(prefabFile);

            if (prefabEditor && prefabEditor instanceof ui.editor.SceneEditor) {

                setTimeout(() => {

                    const obj = node.getObject();
                    const objES = obj.getEditorSupport();

                    let selObj: ISceneGameObject;

                    if (objES.isNestedPrefabInstance()) {

                        selObj = prefabEditor.getScene().getByEditorId(objES.getPrefabId());

                    } else {

                        selObj = prefabEditor.getScene().getPrefabObject();
                    }

                    if (selObj) {

                        const selNode = selObj.getEditorSupport().getUserComponentsComponent().getUserComponentNodes().find(n => n.getComponentName() === node.getComponentName());

                        if (selNode) {

                            prefabEditor.setSelection([selNode]);
                        }
                    }

                }, 10);
            }
        }

        private buildComponentName() {

            const nodes = this.getSelection();

            let name = this.getSelectionFirstElement().getComponentName();

            const prefabNodes = [...new Set(
                nodes
                    .filter(n => n.isPrefabDefined())
                    .map(node => node.getPrefabFile().getNameWithoutExtension()))
            ];

            const prefabNames = prefabNodes.join(", ");

            if (prefabNodes.length === 1) {

                name += " ← " + prefabNames;

            } else if (prefabNodes.length > 1) {

                name += ` ← (${prefabNames})`;
            }

            return name;
        }

        static buildPrefabLinks(nodes: UserComponentNode[], headerDiv: HTMLDivElement) {

            const nodesInPrefabs = nodes.filter(n => n.isPrefabDefined());
            const nodesInPrefabsLen = nodesInPrefabs.length;
            const atLeastOneDefinedInAPrefab = nodesInPrefabsLen > 0;

            if (atLeastOneDefinedInAPrefab) {

                const elem = document.createElement("span");
                elem.innerHTML = " ← ";
                headerDiv.appendChild(elem);

                if (nodesInPrefabsLen > 1) {

                    const elem = document.createElement("label");
                    elem.innerHTML = "(";
                    headerDiv.appendChild(elem);
                }

                for (let i = 0; i < nodesInPrefabsLen; i++) {

                    const node = nodesInPrefabs[i];

                    const prefabFile = nodesInPrefabs[i].getPrefabFile();
                    const prefabBtn = document.createElement("a");
                    headerDiv.appendChild(prefabBtn);
                    prefabBtn.href = "#";
                    prefabBtn.innerHTML = prefabFile.getNameWithoutExtension();
                    prefabBtn.addEventListener("click", e => {

                        this.openPrefabLinkInSceneEditor(node);
                    });

                    if (i < nodesInPrefabsLen - 1) {

                        const elem = document.createElement("label");
                        elem.innerHTML = ", ";
                        headerDiv.appendChild(elem);
                    }
                }

                if (nodesInPrefabs.length > 1) {

                    const elem = document.createElement("label");
                    elem.innerHTML = ")";
                    headerDiv.appendChild(elem);
                }
            }
            return { atLeastOneDefinedInAPrefab };
        }

        static createComponentMenu(
            nodes: UserComponentNode[],
            menu: controls.Menu,
            section: ObjectSingleUserComponentSection | ObjectUserComponentsSection) {

            const firstNode = nodes[0];
            const comp = firstNode.getUserComponent();
            const compName = comp.getName();

            menu.addAction({
                text: `Select Objects With ${compName}`,
                callback: () => {

                    const sel = [];

                    section.getEditor().getScene().visitAll(obj => {

                        if (GameObjectEditorSupport.hasObjectComponent(obj, UserComponentsEditorComponent)) {

                            const userComp = GameObjectEditorSupport
                                .getObjectComponent(obj, UserComponentsEditorComponent) as UserComponentsEditorComponent;

                            if (userComp.hasUserComponent(compName)) {

                                sel.push(obj);
                            }
                        }
                    });

                    section.getEditor().setSelection(sel);
                }
            });

            menu.addAction({
                text: "Open Definition Of " + firstNode.getComponentName(),
                callback: () => this.openComponentEditor(firstNode)
            });

            // the Reveal In Prefab File options
            {
                const fileNodeMap = new Map<io.FilePath, UserComponentNode>();

                for (const node of nodes) {

                    if (node.isPrefabDefined()) {

                        fileNodeMap.set(node.getPrefabFile(), node);
                    }
                }

                for (const prefabFile of fileNodeMap.keys()) {

                    const node = fileNodeMap.get(prefabFile);

                    menu.addAction({
                        text: `Reveal In ${prefabFile.getNameWithoutExtension()} File`,
                        callback: () => this.openPrefabLinkInSceneEditor(node)
                    });
                }
            }

            if (section instanceof ObjectUserComponentsSection) {

                menu.addAction({
                    text: "Edit Values",
                    callback: () => {

                        ObjectSingleUserComponentSection.selectAllComponentNodesFor(section.getEditor(), firstNode);
                    }
                });
            }

            if (!firstNode.isPrefabDefined()) {

                if (nodes.length === 1) {

                    const editorComp = firstNode.getUserComponentsComponent();

                    menu.addAction({
                        text: "Move Up",
                        callback: () => {

                            section.runOperation(() => {

                                editorComp.moveUpUserComponent(compName)
                            });

                            section.updateWithSelection();
                        }
                    });

                    menu.addAction({
                        text: "Move Down",
                        callback: () => {

                            section.runOperation(() => {

                                editorComp.moveDownUserComponent(compName)
                            });

                            section.updateWithSelection();
                        }
                    });
                }

                const allLocalNodes = nodes.filter(n => n.isPrefabDefined()).length === 0;

                if (allLocalNodes) {

                    menu.addAction({
                        text: "Delete",
                        callback: () => {

                            const editor = section.getEditor();

                            const selIds = editor.getSelectionManager().getSelectionIds();

                            section.runOperation(() => {

                                for (const node of nodes) {

                                    node.getUserComponentsComponent().removeUserComponent(compName);
                                }
                            });

                            editor.getSelectionManager().setSelectionByIds(selIds);
                        }
                    });
                }
            }
        }

        createMenu(menu: controls.Menu): void {

            ObjectSingleUserComponentSection.createComponentMenu(this.getSelection(), menu, this);

            menu.addSeparator();

            super.createMenu(menu);
        }

        runOperation(action: () => void) {

            const editor = this.getEditor();

            editor.getUndoManager().add(new ui.editor.undo.SimpleSceneSnapshotOperation(editor, action));
        }

        canEditAll(selection: UserComponentNode[]) {

            const first = selection[0];
            const firstComp = first.getUserComponent();

            for (const node of selection) {

                const comp = node.getUserComponent();

                if (comp.getName() !== firstComp.getName()) {

                    return false;
                }
            }

            return true;
        }

        canEdit(obj: any, n: number): boolean {

            return obj instanceof sceneobjects.UserComponentNode;
        }

        canEditNumber(n: number): boolean {

            return n > 0;
        }
    }
}