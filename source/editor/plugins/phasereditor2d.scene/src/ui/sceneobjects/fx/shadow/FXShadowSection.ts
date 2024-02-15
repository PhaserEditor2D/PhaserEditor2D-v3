namespace phasereditor2d.scene.ui.sceneobjects {

    export class FXShadowSection extends SceneGameObjectSection<FXShadow> {

        constructor(page: colibri.ui.controls.properties.PropertyPage) {
            super(page, "phasereditor2d.scene.ui.sceneobjects.FXShadowSection", "Shadow", false, false);
        }

        createForm(parent: HTMLDivElement): void {

            const comp = this.createGridElement(parent, 3);

            this.createNumberProperty(comp, FXShadowComponent.x);

            this.createNumberProperty(comp, FXShadowComponent.y);

            this.createNumberProperty(comp, FXShadowComponent.decay);

            this.createNumberProperty(comp, FXShadowComponent.power);

            this.createPropertyColorRow(comp, FXShadowComponent.color, false);

            this.createNumberProperty(comp, FXShadowComponent.samples);

            this.createNumberProperty(comp, FXShadowComponent.intensity);
        }

        canEdit(obj: any, n: number): boolean {

            return obj instanceof FXShadow;
        }

        canEditNumber(n: number): boolean {

            return n > 0;
        }
    }
}