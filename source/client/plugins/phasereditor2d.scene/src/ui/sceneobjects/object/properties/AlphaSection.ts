namespace phasereditor2d.scene.ui.sceneobjects {

    export class AlphaSection extends SceneObjectSection<sceneobjects.IAlphaLikeObject> {

        constructor(page: colibri.ui.controls.properties.PropertyPage) {
            super(page, "phasereditor2d.scene.ui.sceneobjects.AlphaSection", "Alpha", false, true);
        }

        protected createForm(parent: HTMLDivElement) {

            const comp = this.createGridElementWithPropertiesXY(parent);

            this.createNumberPropertyRow(comp, AlphaComponent.alpha, true);

            this.createPropertyXYRow(comp, AlphaComponent.alphaTop);

            this.createPropertyXYRow(comp, AlphaComponent.alphaBottom);
        }

        canEdit(obj: any, n: number): boolean {

            return EditorSupport.getObjectComponent(obj, AlphaComponent) && n > 0;
        }

        canEditNumber(n: number): boolean {

            return n > 0;
        }
    }
}