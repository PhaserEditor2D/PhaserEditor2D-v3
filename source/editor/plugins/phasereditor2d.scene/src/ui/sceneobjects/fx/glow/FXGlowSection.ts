namespace phasereditor2d.scene.ui.sceneobjects {

    export class FXGlowSection extends SceneGameObjectSection<FXGlow> {

        constructor(page: colibri.ui.controls.properties.PropertyPage) {
            super(page, "phasereditor2d.scene.ui.sceneobjects.FXGlowSection", "Glow", false, false);
        }

        createForm(parent: HTMLDivElement): void {

            const comp = this.createGridElement(parent, 3);

            this.createPropertyColorRow(comp, FXGlowComponent.color, false);

            this.createNumberProperty(comp, FXGlowComponent.outerStrength);

            this.createNumberProperty(comp, FXGlowComponent.innerStrength);

            this.createPropertyBoolean(comp, FXGlowComponent.knockout);
        }

        canEdit(obj: any, n: number): boolean {

            return obj instanceof FXGlow;
        }

        canEditNumber(n: number): boolean {

            return n > 0;
        }
    }
}