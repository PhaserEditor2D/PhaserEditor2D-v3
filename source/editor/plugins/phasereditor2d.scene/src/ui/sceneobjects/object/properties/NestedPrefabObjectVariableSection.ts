/// <reference path="./SceneGameObjectSection.ts"/>

namespace phasereditor2d.scene.ui.sceneobjects {

    import controls = colibri.ui.controls;

    export class NestedPrefabObjectVariableSection extends SceneGameObjectSection<ISceneGameObject> {

        constructor(page: controls.properties.PropertyPage) {
            super(page, "phasereditor2d.scene.ui.sceneobjects.NestedPrefabObjectVariableSection", "Variable", false);
        }

        getSectionHelpPath() {

            return "scene-editor/variable-properties.html";
        }

        createForm(parent: HTMLDivElement) {

            const comp = this.createGridElement(parent, 2);

            {
                // Name

                this.createLabel(comp, "Name", "The name of the variable associated to this object. This name is used by the compiler.");

                const text = this.createText(comp, true);

                this.addUpdater(() => {

                    text.value = this.flatValues_StringOneOrNothing(
                        this.getSelection()
                            .map(obj => this.getVarName(obj)));
                })
            }

            {
                // Type

                const { btn } = GameObjectVariableSection.createTypeEditor(this, comp);
                btn.disabled = true;
            }
        }

        private getVarName(obj: ISceneGameObject) {

            const varName = core.code.SceneCodeDOMBuilder.getPrefabInstanceVarName(obj);

            return varName;
        }

        canEdit(obj: any, n: number): boolean {

            if (isGameObject(obj)) {

                const objES = (obj as sceneobjects.ISceneGameObject).getEditorSupport();

                return objES.isNestedPrefabInstance();
            }

            return false;
        }

        canEditNumber(n: number): boolean {

            return n === 1;
        }
    }
}