/// <reference path="./SceneObjectSection.ts"/>

namespace phasereditor2d.scene.ui.sceneobjects {

    import controls = colibri.ui.controls;

    export class GameObjectVariableSection extends SceneObjectSection<ISceneObjectLike> {

        constructor(page: controls.properties.PropertyPage) {
            super(page, "phasereditor2d.scene.ui.sceneobjects.GameObjectVariableSection", "Variable", false);
        }

        protected createForm(parent: HTMLDivElement) {

            const comp = this.createGridElement(parent, 2);

            {
                // Name

                this.createLabel(comp, "Name");

                this.createStringField(comp, VariableComponent.label, false);
            }

            {
                // Type

                this.createLabel(comp, "Type");

                const text = this.createText(comp, true);

                this.addUpdater(() => {

                    text.value = this.flatValues_StringJoin(

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

                this.createLabel(comp, "Scope", "The lexical scope of the object.");
                this.createEnumField(comp, VariableComponent.scope, false);
            }
        }

        canEdit(obj: any, n: number): boolean {
            return obj instanceof Phaser.GameObjects.GameObject;
        }

        canEditNumber(n: number): boolean {
            return n === 1;
        }
    }
}