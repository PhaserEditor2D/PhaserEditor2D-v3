namespace phasereditor2d.scene.ui.sceneobjects {

    import controls = colibri.ui.controls;

    export class EllipseSection extends SceneGameObjectSection<Ellipse> {

        constructor(page: controls.properties.PropertyPage) {
            super(page, "phasereditor2d.scene.ui.sceneobjects.EllipseSection", "Ellipse", false, true);
        }

        createForm(parent: HTMLDivElement) {

            const comp = this.createGridElement(parent);
            comp.style.gridTemplateColumns = "auto auto 1fr";

            this.createNumberProperty(comp, EllipseComponent.smoothness);
        }

        canEdit(obj: any, n: number): boolean {

            return obj instanceof Ellipse;
        }

        canEditNumber(n: number): boolean {

            return n > 0;
        }
    }
}