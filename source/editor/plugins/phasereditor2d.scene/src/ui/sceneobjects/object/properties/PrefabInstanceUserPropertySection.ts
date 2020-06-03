namespace phasereditor2d.scene.ui.sceneobjects {

    import controls = colibri.ui.controls;

    export class PrefabInstanceUserPropertySection extends SceneObjectSection<ISceneObject> {

        private _propArea: HTMLDivElement;

        constructor(page: controls.properties.PropertyPage) {
            super(page,
                "phasereditor2d.scene.ui.sceneobjects.PrefabInstanceUserPropertySection", "Prefab Instance User Properties");
        }

        protected createForm(parent: HTMLDivElement) {

            const comp = this.createGridElement(parent);
            comp.style.gridTemplateColumns = "1fr";

            this._propArea = this.createGridElement(comp);
            this._propArea.style.gridTemplateColumns = "auto auto 1fr";

            comp.appendChild(this._propArea);

            this.addUpdater(() => {

                this._propArea.innerHTML = "";

                const obj = this.getSelectionFirstElement() as ISceneObject;

                const userPropsComponent = EditorSupport
                    .getObjectComponent(obj, UserPropertyComponent) as UserPropertyComponent;

                const propsByPrefabList = userPropsComponent.getPropertiesByPrefab();

                for (const propsByPrefab of propsByPrefabList) {

                    const prefabName = propsByPrefab.prefabFile.getNameWithoutExtension();

                    const label = this.createLabel(this._propArea, prefabName);
                    label.style.gridColumn = "1 / span 3";
                    label.style.justifySelf = "self-start";

                    for (const prop of propsByPrefab.properties) {

                        prop.getType().createInspectorPropertyEditor(this, this._propArea, prop);
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

            if (EditorSupport.hasEditorSupport(obj)) {

                const support = EditorSupport.getEditorSupport(obj);

                if (support.isPrefabInstance()) {

                    const prefabFile = support.getPrefabFile();

                    const sceneData = ScenePlugin.getInstance().getSceneFinder().getSceneData(prefabFile);

                    if (!sceneData.prefabProperties || sceneData.prefabProperties.length === 0) {
                        // don't accept prefab instances without any user property.
                        return false;
                    }

                    for (const obj2 of this.getSelection()) {

                        if (EditorSupport.hasEditorSupport(obj2)) {

                            const support2 = EditorSupport.getEditorSupport(obj2);

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