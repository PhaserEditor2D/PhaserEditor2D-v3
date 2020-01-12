namespace phasereditor2d.scene.ui.sceneobjects {

    import controls = colibri.ui.controls;
    import ide = colibri.ui.ide;
    import core = colibri.core;

    export class OriginSection extends editor.properties.BaseSceneSection<IOriginLike> {

        constructor(page: controls.properties.PropertyPage) {
            super(page, "SceneEditor.OriginSection", "Origin", false);
        }

        protected createForm(parent: HTMLDivElement) {
            const comp = this.createGridElement(parent, 5);

            // Position

            {
                this.createLabel(comp, "Origin");

                // X

                {
                    this.createLabel(comp, "X");
                    const text = this.createText(comp);
                    this.addUpdater(() => {
                        text.value = this.flatValues_Number(this.getSelection().map(obj => obj.originX));
                    });
                }

                // y

                {
                    this.createLabel(comp, "Y");
                    const text = this.createText(comp);
                    this.addUpdater(() => {
                        text.value = this.flatValues_Number(this.getSelection().map(obj => obj.originY));
                    });
                }
            }
        }

        canEdit(obj: any, n: number): boolean {
            return EditorSupport.getObjectComponent(obj, OriginComponent) !== null;
        }

        canEditNumber(n: number): boolean {
            return n > 0;
        }
    }

}