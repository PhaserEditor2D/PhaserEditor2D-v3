namespace phasereditor2d.scene.ui.sceneobjects {

    import controls = colibri.ui.controls;
    import UserComponent = editor.usercomponent.UserComponent;

    class GameObjectSectionWrapper extends SceneGameObjectSection<ISceneGameObject> {

        private _nodes: UserComponentNode[];

        constructor(page: controls.properties.PropertyPage, nodes: UserComponentNode[]) {
            super(page, "id", "title");

            this._nodes = nodes;
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

            return this._nodes.map(node => node.getObject());
        }
    }

    export class ObjectSingleUserComponentSection extends editor.properties.BaseSceneSection<UserComponentNode> {

        private _propArea: HTMLDivElement;

        constructor(page: controls.properties.PropertyPage) {
            super(page,
                "phasereditor2d.scene.ui.sceneobjects.ObjectSingleUserComponentSection", "User Component", false, true);
        }

        getSectionHelpPath() {
            return "scene-editor/user-components-instancing.html";
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

                const nodes = this.getSelection();
                const node = nodes[0];

                const compName = node.getUserComponent().getName();
                const compInfo = finder.getUserComponentByName(compName);

                const headerDiv = document.createElement("div");
                headerDiv.classList.add("PrefabLink");

                this._propArea.appendChild(headerDiv);

                // open component editor link

                const compBtn = document.createElement("a");
                headerDiv.appendChild(compBtn);
                compBtn.href = "#";
                compBtn.innerHTML = compName;
                compBtn.addEventListener("click", e => {

                    const info = finder.getUserComponentByName(compName);

                    const editor = colibri.Platform.getWorkbench().openEditor(info.file) as editor.usercomponent.UserComponentsEditor;

                    editor.revealComponent(compName);

                    colibri.Platform.getWorkbench().openEditor(compInfo.file);
                });

                // open prefab file link

                const { atLeastOneDefinedInAPrefab } = ObjectSingleUserComponentSection.buildPrefabLinks(nodes, headerDiv);

                // properties

                {
                    const props = compInfo.component.getUserProperties().getProperties();

                    if (props.length > 0) {

                        const compPropArea = this.createGridElement(this._propArea);
                        compPropArea.style.gridTemplateColumns = "auto auto 1fr";
                        compPropArea.style.width = "100%";

                        const objSectionWrapper = new GameObjectSectionWrapper(this.getPage(), this.getSelection());

                        this.addUpdater(() => {

                            objSectionWrapper.updateWithSelection();
                        });

                        for (const prop of props) {

                            prop.getType().createInspectorPropertyEditor(objSectionWrapper, compPropArea, prop, atLeastOneDefinedInAPrefab);
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
        }

        static buildPrefabLinks(nodes: UserComponentNode[], headerDiv: HTMLDivElement) {

            const nodesInPrefabs = nodes.filter(n => n.isPrefabDefined());
            const nodesInPrefabsLen = nodesInPrefabs.length;
            const atLeastOneDefinedInAPrefab = nodesInPrefabsLen > 0;

            if (atLeastOneDefinedInAPrefab) {

                const elem = document.createElement("label");
                elem.innerHTML = " @ ";
                headerDiv.appendChild(elem);

                if (nodesInPrefabsLen > 1) {

                    const elem = document.createElement("label");
                    elem.innerHTML = "(";
                    headerDiv.appendChild(elem);
                }

                for (let i = 0; i < nodesInPrefabsLen; i++) {

                    const prefabFile = nodesInPrefabs[i].getPrefabFile();
                    const prefabBtn = document.createElement("a");
                    headerDiv.appendChild(prefabBtn);
                    prefabBtn.href = "#";
                    prefabBtn.innerHTML = prefabFile.getNameWithoutExtension();
                    prefabBtn.addEventListener("click", e => {

                        colibri.Platform.getWorkbench().openEditor(prefabFile);
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

            const node = nodes[0];
            const comp = node.getUserComponent();
            const compName = comp.getName();

            menu.addAction({
                text: `Select All With ${compName}`,
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

            if (!node.isPrefabDefined()) {

                menu.addSeparator();

                if (nodes.length === 1) {

                    const editorComp = node.getUserComponentsComponent();

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