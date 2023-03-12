/// <reference path="./SceneGameObjectSection.ts"/>

namespace phasereditor2d.scene.ui.sceneobjects {

    import controls = colibri.ui.controls;

    export class GameObjectVariableSection extends SceneGameObjectSection<ISceneGameObject> {

        constructor(page: controls.properties.PropertyPage) {
            super(page, "phasereditor2d.scene.ui.sceneobjects.GameObjectVariableSection", "Variable", false);
        }

        getSectionHelpPath() {

            return "scene-editor/variable-properties.html";
        }

        createMenu(menu: controls.Menu) {

            const creator = this.getEditor().getMenuCreator();

            creator.createTypeMenuItems(menu);

            menu.addSeparator();

            menu.addCommand(editor.commands.CMD_CREATE_PREFAB_WITH_OBJECT);

            menu.addSeparator();

            super.createMenu(menu);
        }

        createForm(parent: HTMLDivElement) {

            const comp = this.createGridElement(parent, 2);

            {
                // Name

                this.createLabel(comp, "Name", "The name of the variable associated to this object. This name is used by the compiler.");

                this.createStringField(comp, VariableComponent.label, false, true);
            }

            {
                // GameObject name

                this.createBooleanField(comp, VariableComponent.useGameObjectName, false);
            }

            GameObjectVariableSection.createTypeEditor(this, comp);

            {
                // Scope

                this.createLabel(comp, "Scope", "The lexical scope of this object's variable, in code.");
                this.createEnumField(comp, VariableComponent.scope, false, scope => {

                    if (this.getEditor().getScene().isPrefabSceneType()) {

                        return true;
                    }

                    return scope !== ObjectScope.NESTED_PREFAB;
                });
            }
        }

        static createTypeEditor(section: SceneGameObjectSection<ISceneGameObject>, parentElement: HTMLElement) {

            section.createLabel(parentElement, "Type", "The type of the object.");

            const btn = section.createButton(parentElement, "", e => {

                const dlg = new editor.ConvertTypeDialog(section.getEditor());

                dlg.create();
            });

            section.addUpdater(() => {

                btn.textContent = section.flatValues_StringJoinDifferent(

                    section.getSelection().map(obj => {

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

        canEdit(obj: any, n: number): boolean {

            return GameObjectEditorSupport.hasObjectComponent(obj, VariableComponent)
                && !this.isPrefabSceneObject(obj)
                && !isNestedPrefabInstance(obj);
        }

        canEditNumber(n: number): boolean {

            return n > 0;
        }
    }
}