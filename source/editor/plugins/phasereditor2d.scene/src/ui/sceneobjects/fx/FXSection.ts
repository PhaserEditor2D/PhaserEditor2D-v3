namespace phasereditor2d.scene.ui.sceneobjects {

    export class FXSection extends SceneGameObjectSection<FXObject> {

        constructor(page: colibri.ui.controls.properties.PropertyPage) {
            super(page, "phasereditor2d.scene.ui.sceneobjects.FXSection", "FX", false, true);
        }

        createForm(parent: HTMLDivElement): void {

            const comp = this.createGridElement(parent, 2);

            this.createLabel(comp, "Pipeline", "The pipeline.");

            const btn = this.createButton(comp, "", () => { });


            this.addUpdater(() => {

                const preFX = this.flatValues_BooleanAnd(this.getSelection().map(obj => obj.isPreFX()));

                btn.textContent = preFX ? "Pre FX" : "Post FX";
            });
        }

        canEdit(obj: any, n: number): boolean {

            return obj instanceof FXObject;
        }

        canEditNumber(n: number): boolean {

            return n > 0;
        }
    }
}