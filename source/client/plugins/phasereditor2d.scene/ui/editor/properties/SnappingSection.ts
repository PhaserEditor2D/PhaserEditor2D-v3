namespace phasereditor2d.scene.ui.editor.properties {

    import controls = colibri.ui.controls;

    export class SnappingSection extends SceneSection {

        constructor(page: controls.properties.PropertyPage) {
            super(page, "phasereditor2d.scene.ui.editor.properties.SnappingSection", "Snapping");
        }

        protected createForm(parent: HTMLDivElement) {

            const comp = this.createGridElement(parent, 3);

            comp.style.gridTemplateColumns = "auto auto 1fr auto 1fr";

            {
                this.createBooleanField(comp, "snapEnabled", "Enabled", "Enable snapping")

                    .comp.style.gridColumn = "1 / span 5";
            }

            this.createLabel(comp, "Size");
            this.createIntegerField(comp, "snapWidth", "Width", "Scene snapping width.");
            this.createIntegerField(comp, "snapHeight", "Height", "Scene snapping height.");
        }
    }
}