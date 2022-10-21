namespace phasereditor2d.scene.ui.sceneobjects {

    import controls = colibri.ui.controls;
    import UserComponent = editor.usercomponent.UserComponent;

    export class ObjectUserComponentsSection extends SceneGameObjectSection<ISceneGameObject> {

        private _propArea: HTMLDivElement;

        constructor(page: controls.properties.PropertyPage) {
            super(page,
                "phasereditor2d.scene.ui.sceneobjects.ObjectUserComponentsSection", "User Components", false, true);
        }

        getSectionHelpPath() {
            return "scene-editor/user-components-instancing.html";
        }

        private getCommonComponentNodes() {

            const nameCountMap = new Map<string, number>();

            let selection = this.getSelection()
                .flatMap(obj => obj.getEditorSupport().getUserComponentsComponent().getUserComponentNodes());

            let nodes: UserComponentNode[] = [];

            for (const node of selection) {

                const name = node.getUserComponent().getName();

                if (nameCountMap.has(name)) {

                    const count = nameCountMap.get(name);
                    nameCountMap.set(name, count + 1);

                } else {

                    nameCountMap.set(name, 1);
                    nodes.push(node);
                }
            }

            const total = this.getSelection().length;

            nodes = nodes
                .filter(node => nameCountMap.get(node.getUserComponent().getName()) === total);

            nodes.sort((a, b) => {

                const aa = a.isPrefabDefined() ? 1 : 0;
                const bb = b.isPrefabDefined() ? 1 : 0;

                return aa - bb;
            });

            return nodes;
        }

        private getCommonComponents(getComponents: (c: UserComponentsEditorComponent) => string[]) {

            const nameCountMap = new Map<string, number>();

            for (const obj of this.getSelection()) {

                const editorComp = GameObjectEditorSupport.getObjectComponent(obj, UserComponentsEditorComponent) as UserComponentsEditorComponent;

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
                    .map(obj => GameObjectEditorSupport.getObjectComponent(obj, UserComponentsEditorComponent) as UserComponentsEditorComponent);

                // const commonLocalComponents = this.getCommonComponents(c => c.getLocalUserComponents().map(info => info.component.getName()));

                const commonNodes = this.getCommonComponentNodes();

                for (const node of commonNodes) {

                    const compName = node.getUserComponent().getName();

                    const headerDiv = document.createElement("div");
                    headerDiv.classList.add("PrefabLink");

                    this._propArea.appendChild(headerDiv);

                    const compBtn = document.createElement("a");
                    headerDiv.appendChild(compBtn);
                    compBtn.href = "#";
                    compBtn.innerHTML = compName;
                    compBtn.addEventListener("click", e => {

                        const nodes = this.getSelection()
                            .flatMap(obj => obj.getEditorSupport()
                                .getUserComponentsComponent().getUserComponentNodes())
                            .filter(node => node.getUserComponent().getName() === compName);

                        this.getEditor().setSelection(nodes);
                    });

                    // get all nodes (from the selected objects)
                    // with the same user component of this current node
                    const sameNodes = this.getSelection()
                        .flatMap(obj => obj.getEditorSupport()
                            .getUserComponentsComponent().getUserComponentNodes())
                        .filter(n => n.getUserComponent().getName() === compName);

                    const samePrefabNodes = sameNodes.filter(n => n.isPrefabDefined());

                    ObjectSingleUserComponentSection.buildPrefabLinks(samePrefabNodes, headerDiv);


                    this.createComponentMenuIcon(headerDiv, sameNodes);
                }

                // Add Components button

                const btn = this.createButton(this._propArea, "Add Component", () => {

                    const used = new Set(
                        [...editorCompList
                            .flatMap(editorComp => editorComp.getLocalUserComponents())
                            .map(info => info.component.getName()),

                        ...editorCompList.flatMap(editorComp => editorComp.getPrefabUserComponents())
                            .flatMap(info => info.components)
                            .map(c => c.getName())
                        ]
                    );

                    class ContentProvider implements controls.viewers.ITreeContentProvider {

                        getRoots(input: any): any[] {

                            return finder.getUserComponentsModels()
                                .filter(info => info.model.getComponents().filter(c => !used.has(c.getName())).length > 0);
                        }

                        getChildren(parentObj: core.json.IUserComponentsModelInfo | UserComponent): any[] {

                            if (parentObj instanceof UserComponent) {

                                return [];
                            }

                            return parentObj.model.getComponents().filter(c => !used.has(c.getName()));
                        }
                    }

                    const viewer = new controls.viewers.TreeViewer("UserComponentInstancePropertySection.addComponentDialogViewer");

                    viewer.setStyledLabelProvider({
                        getStyledTexts: (obj: UserComponent | core.json.IUserComponentsModelInfo, dark) => {

                            const theme = controls.Controls.getTheme();

                            if (obj instanceof UserComponent) {

                                return [{
                                    text: obj.getName(),
                                    color: theme.viewerForeground
                                }];
                            }

                            return [{
                                text: obj.file.getNameWithoutExtension(),
                                color: theme.viewerForeground
                            }, {
                                text: " - " + obj.file.getParent().getProjectRelativeName()
                                    .split("/").filter(s => s !== "").reverse().join("/"),
                                color: theme.viewerForeground + "90"
                            }];
                        }
                    });

                    viewer.setCellRendererProvider(new controls.viewers.EmptyCellRendererProvider(
                        (obj: core.json.IUserComponentsModelInfo | UserComponent) =>
                            new controls.viewers.IconImageCellRenderer(
                                obj instanceof UserComponent ?
                                    ScenePlugin.getInstance().getIcon(ICON_USER_COMPONENT)
                                    : colibri.ColibriPlugin.getInstance().getIcon(colibri.ICON_FOLDER))));

                    viewer.setContentProvider(new ContentProvider());

                    viewer.setInput([]);

                    viewer.expandRoots(false);

                    const dlg = new controls.dialogs.ViewerDialog(viewer, false);

                    dlg.setSize(undefined, 400, true);

                    dlg.create();

                    dlg.setTitle("User Component");

                    dlg.enableButtonOnlyWhenOneElementIsSelected(dlg.addOpenButton("Add Component", () => {

                        const selComp = viewer.getSelectionFirstElement() as UserComponent;

                        if (selComp) {

                            this.runOperation(() => {

                                for (const editorComp of editorCompList) {

                                    editorComp.addUserComponent(selComp.getName());
                                }
                            });

                            this.updateWithSelection();
                        }
                    }), obj => obj instanceof UserComponent);

                    dlg.addCancelButton();
                });

                btn.style.width = "100%";
                btn.style.justifySelf = "self-center";
                btn.style.marginTop = "10px";
            });
        }

        private createComponentMenuIcon(
            headerDiv: HTMLElement, nodes: UserComponentNode[]) {

            this.createMenuIcon(headerDiv, () => {

                const menu = new controls.Menu();

                ObjectSingleUserComponentSection.createComponentMenu(nodes, menu, this);

                return menu;
            });
        }

        runOperation(action: () => void) {

            const editor = this.getEditor();

            editor.getUndoManager().add(new ui.editor.undo.SimpleSceneSnapshotOperation(editor, action));
        }

        canEdit(obj: any, n: number): boolean {

            return GameObjectEditorSupport.hasEditorSupport(obj);
        }

        canEditNumber(n: number): boolean {

            return n > 0;
        }
    }
}