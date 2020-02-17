namespace phasereditor2d.scene.ui.sceneobjects {

    import controls = colibri.ui.controls;

    export class BitmapTextSection extends SceneObjectSection<BitmapText> {

        constructor(page: controls.properties.PropertyPage) {
            super(page, "phasereditor.scene.ui.sceneobjects.BitmapTextSection", "Bitmap Text");
        }

        protected createForm(parent: HTMLDivElement) {

            const comp = this.createGridElementWithPropertiesXY(parent);

        }

        canEdit(obj: any, n: number): boolean {

            return obj instanceof BitmapText;
        }

        canEditNumber(n: number): boolean {

            return n > 0;
        }
    }
}