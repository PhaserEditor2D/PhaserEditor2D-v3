namespace phasereditor2d.scene.ui.sceneobjects {

    import controls = colibri.ui.controls;

    export class VariableSection extends editor.properties.SceneSection<sceneobjects.SceneObject> {

        constructor(page: controls.properties.PropertyPage) {
            super(page, "SceneEditor.VariableSection", "Variable", false);
        }

        protected createForm(parent: HTMLDivElement) {
            const comp = this.createGridElement(parent, 2);

            {
                // Name

                this.createLabel(comp, "Name");
                const text = this.createText(comp);
                this.addUpdater(() => {
                    text.value = this.flatValues_StringJoin(
                        this.getSelection().map(obj => obj.getEditorSupport().getLabel())
                    );
                });
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
        }

        canEdit(obj: any, n: number): boolean {
            return obj instanceof Phaser.GameObjects.GameObject;
        }

        canEditNumber(n: number): boolean {
            return n === 1;
        }
    }
}