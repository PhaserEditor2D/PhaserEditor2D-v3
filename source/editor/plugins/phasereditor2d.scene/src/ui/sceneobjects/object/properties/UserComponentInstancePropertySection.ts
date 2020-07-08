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

                const compInfoList = editorComponent.getUserComponents();

                for (const compInfo of compInfoList) {

                    const compName = compInfo.comp.getName();

                    const compBtn = document.createElement("a");
                    compBtn.classList.add("PrefabLink");
                    compBtn.href = "#";
                    compBtn.innerHTML = compName;
                    compBtn.style.gridColumn = "1 / span 3";
                    compBtn.style.justifySelf = "self-start";
                    compBtn.addEventListener("click", e => {

                        colibri.Platform.getWorkbench().openEditor(compInfo.file);
                    });

                    this._propArea.appendChild(compBtn);

                    for (const prop of compInfo.comp.getUserProperties().getProperties()) {

                        prop.getType().createInspectorPropertyEditor(this, this._propArea, prop);
                    }
                }

                const finder = ScenePlugin.getInstance().getSceneFinder();

                const items = finder.getUserComponentsModels()

                    .flatMap(info => info.model.getComponents())

                    .map(c => ({
                        name: c.getName(),
                        value: c.getName()
                    }));


                const btn = this.createMenuButton(this._propArea, "Add Component", items, (value: string) => {

                    const compInfo = finder.getUserComponentByName(value);

                    if (compInfo) {

                        editorComponent.addUserComponent(value);

                        this.updateWithSelection();
                    }
                });
                btn.style.gridColumn = "1 / span 3";
                btn.style.justifySelf = "self-center";
            });
        }

        canEdit(obj: any, n: number): boolean {

            return EditorSupport.hasEditorSupport(obj);
        }

        canEditNumber(n: number): boolean {

            return n === 1;
        }
    }
}