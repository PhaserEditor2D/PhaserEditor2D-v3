namespace phasereditor2d.scene.ui.sceneobjects {

    import controls = colibri.ui.controls;

    export class UserComponentInstancePropertySection extends SceneObjectSection<ISceneObject> {

        private _propArea: HTMLDivElement;

        constructor(page: controls.properties.PropertyPage) {
            super(page,
                "phasereditor2d.scene.ui.sceneobjects.UserComponentInstancePropertySection", "User Components", false, true);
        }

        getSectionHelpPath() {
            // TODO
            return "scene-editor/user-component.html";
        }

        createForm(parent: HTMLDivElement) {

            const comp = this.createGridElement(parent);
            comp.style.gridTemplateColumns = "1fr";

            this._propArea = this.createGridElement(comp);
            this._propArea.style.gridTemplateColumns = "auto auto 1fr";

            comp.appendChild(this._propArea);

            this.addUpdater(() => {

                this._propArea.innerHTML = "";

                const obj = this.getSelectionFirstElement() as ISceneObject;

                const editorComponent = EditorSupport
                    .getObjectComponent(obj, UserComponentsEditorComponent) as UserComponentsEditorComponent;

                // local components

                const compInfoList = editorComponent.getUserComponents();

                for (const compInfo of compInfoList) {

                    const compName = compInfo.comp.getName();

                    const headerDiv = document.createElement("div");
                    headerDiv.classList.add("PrefabLink");
                    headerDiv.style.gridColumn = "1 / span 3";
                    headerDiv.style.width = "100%";

                    this._propArea.appendChild(headerDiv);

                    const compBtn = document.createElement("a");
                    headerDiv.appendChild(compBtn);
                    compBtn.href = "#";
                    compBtn.innerHTML = compName;
                    compBtn.addEventListener("click", e => {

                        colibri.Platform.getWorkbench().openEditor(compInfo.file);
                    });

                    const icon = new controls.IconControl(colibri.ColibriPlugin.getInstance().getIcon(colibri.ICON_DELETE));
                    const iconElement = icon.getCanvas();
                    controls.Tooltip.tooltip(iconElement, "Remove this component.");
                    iconElement.classList.add("IconButton");
                    headerDiv.appendChild(iconElement);
                    iconElement.style.float = "right";
                    iconElement.addEventListener("click", e => {

                        this.runOperation(() => {

                            editorComponent.removeUserComponent(compName);
                        });

                        this.updateWithSelection();
                    });

                    for (const prop of compInfo.comp.getUserProperties().getProperties()) {

                        prop.getType().createInspectorPropertyEditor(this, this._propArea, prop, false);
                    }
                }

                // prefab components

                for (const compInfo of editorComponent.getPrefabUserComponents()) {

                    for (const userComp of compInfo.components) {

                        const headerDiv = document.createElement("div");
                        headerDiv.classList.add("PrefabLink");
                        headerDiv.style.gridColumn = "1 / span 3";
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

                        for (const prop of userComp.getUserProperties().getProperties()) {

                            prop.getType().createInspectorPropertyEditor(this, this._propArea, prop, true);
                        }
                    }
                }

                // Add Components button

                const finder = ScenePlugin.getInstance().getSceneFinder();

                const items = finder.getUserComponentsModels()

                    .flatMap(info => info.model.getComponents())

                    .filter(c => !editorComponent.hasUserComponent(c.getName()))

                    .map(c => ({
                        name: c.getName(),
                        value: c.getName()
                    }));

                const btn = this.createMenuButton(this._propArea, "Add Component", items, (value: string) => {

                    const compInfo = finder.getUserComponentByName(value);

                    if (compInfo) {

                        this.runOperation(() => {

                            editorComponent.addUserComponent(value);
                        });

                        this.updateWithSelection();
                    }
                });
                btn.style.gridColumn = "1 / span 3";
                btn.style.justifySelf = "self-center";
                btn.style.marginTop = "10px";
                btn.disabled = items.length === 0;
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

            return n === 1;
        }
    }
}