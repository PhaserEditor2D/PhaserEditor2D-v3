namespace phasereditor2d.scene.ui.sceneobjects {

    import controls = colibri.ui.controls;

    export class NineSliceSection extends SceneGameObjectSection<NineSlice> {

        static SECTION_ID = "phasereditor2d.scene.ui.sceneobjects.NineSliceSection";

        constructor(page: controls.properties.PropertyPage) {
            super(page, NineSliceSection.SECTION_ID, "Nine Slice", false, false);
        }

        createForm(parent: HTMLDivElement) {

            const comp = this.createGridElementWithPropertiesXY(parent);

            this.createPropertyXYRow(comp, NineSliceComponent.horizontalWidth);
            this.createPropertyXYRow(comp, NineSliceComponent.verticalWidth);
        }

        canEdit(obj: any, n: number): boolean {

            return obj instanceof NineSlice;
        }

        canEditNumber(n: number): boolean {

            return n > 0;
        }

        getSectionHelpPath() {
            // return "scene-editor/tile-sprite-object.html#tile-sprite-properties";
            // TODO
            return "";
        }
    }
}