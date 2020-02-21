namespace phasereditor2d.scene.ui.sceneobjects {

    export class AlphaSection extends SceneObjectSection<sceneobjects.IAlphaLikeObject> {

        constructor(page: colibri.ui.controls.properties.PropertyPage) {
            super(page, "phasereditor2d.scene.ui.sceneobjects.AlphaSection", "Alpha", false);
        }

        protected createForm(parent: HTMLDivElement) {

            const comp = this.createGridElement(parent);
            comp.style.gridTemplateColumns = "auto auto 1fr";

            this.createNumberProperty(comp, AlphaComponent.alpha);
        }

        canEdit(obj: any, n: number): boolean {

            return EditorSupport.getObjectComponent(obj, AlphaComponent) && n > 0;
        }

        canEditNumber(n: number): boolean {

            return n > 0;
        }
    }
}