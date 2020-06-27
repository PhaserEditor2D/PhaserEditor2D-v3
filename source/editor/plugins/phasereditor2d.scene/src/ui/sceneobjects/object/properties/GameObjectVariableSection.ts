/// <reference path="./SceneObjectSection.ts"/>

namespace phasereditor2d.scene.ui.sceneobjects {

    import controls = colibri.ui.controls;

    export class GameObjectVariableSection extends SceneObjectSection<ISceneObjectLike> {

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

        protected createForm(parent: HTMLDivElement) {

            const comp = this.createGridElement(parent, 2);

            {
                // Name

                this.createLabel(comp, "Name", "The name of the variable associated to this object. This name is used by the compiler.");

                this.createStringField(comp, VariableComponent.label, false, true);
            }

            {
                // Type

                this.createLabel(comp, "Type", "The type of the object.");

                const text = this.createText(comp, true);

                this.addUpdater(() => {

                    text.value = this.flatValues_StringJoinDifferent(

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

            {
                // Scope

                this.createLabel(comp, "Scope", "The lexical scope of this object's variable, in code.");
                this.createEnumField(comp, VariableComponent.scope, false);
            }
        }

        canEdit(obj: any, n: number): boolean {

            if (obj instanceof Phaser.GameObjects.GameObject) {

                const scene = this.getEditor().getScene();

                if (scene.isPrefabSceneType()) {

                    if (scene.getPrefabObject() === obj) {

                        return false;
                    }
                }

                return true;
            }

            return false;
        }

        canEditNumber(n: number): boolean {
            return n > 0;
        }
    }
}