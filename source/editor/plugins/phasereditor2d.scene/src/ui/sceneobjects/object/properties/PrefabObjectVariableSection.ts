/// <reference path="./SceneGameObjectSection.ts"/>

namespace phasereditor2d.scene.ui.sceneobjects {

    import controls = colibri.ui.controls;

    export class PrefabObjectVariableSection extends SceneGameObjectSection<ISceneGameObject> {

        constructor(page: controls.properties.PropertyPage) {
            super(page, "phasereditor2d.scene.ui.sceneobjects.PrefabObjectVariableSection", "Variable", false);
        }

        getSectionHelpPath() {

            return "scene-editor/variable-properties.html";
        }

        createForm(parent: HTMLDivElement) {

            const comp = this.createGridElement(parent, 2);

            {
                // Type

                this.createLabel(comp, "Type", "The type of the object.");

                const btn = this.createButton(comp, "", e => {

                    const dlg = new editor.ConvertTypeDialog(this.getEditor());

                    dlg.create();
                });

                this.addUpdater(() => {

                    btn.textContent = this.flatValues_StringJoinDifferent(

                        this.getSelection().map(obj => {

                            const support = obj.getEditorSupport();

                            let typename = support.getObjectType();

                            if (support.isPrefabInstance()) {

                                typename = `prefab ${support.getPrefabName()} (${typename})`;
                            }

                            return typename;
                        })
                    );
                });
            }
        }

        canEdit(obj: any, n: number): boolean {

            return GameObjectEditorSupport.hasObjectComponent(obj, VariableComponent)
                && this.isPrefabSceneObject(obj);
        }

        canEditNumber(n: number): boolean {

            return n === 1;
        }
    }
}