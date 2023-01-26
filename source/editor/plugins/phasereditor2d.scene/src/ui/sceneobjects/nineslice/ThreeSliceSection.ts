namespace phasereditor2d.scene.ui.sceneobjects {

    import controls = colibri.ui.controls;

    export class ThreeSliceSection extends SceneGameObjectSection<ThreeSlice> {

        static SECTION_ID = "phasereditor2d.scene.ui.sceneobjects.ThreeSliceSection";

        constructor(page: controls.properties.PropertyPage) {
            super(page, ThreeSliceSection.SECTION_ID, "Three Slice", false, false);
        }

        createForm(parent: HTMLDivElement) {

            const comp = this.createGridElementWithPropertiesXY(parent);

            this.createPropertyXYRow(comp, ThreeSliceComponent.horizontalWidth);

            const btn = this.createButton(comp, "Edit Slices", () => {

                this.getEditor().getToolsManager().activateTool(SliceTool.ID);
            });

            btn.style.gridColumn = "1 / span 6";
        }

        canEdit(obj: any, n: number): boolean {

            return obj instanceof ThreeSlice;
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