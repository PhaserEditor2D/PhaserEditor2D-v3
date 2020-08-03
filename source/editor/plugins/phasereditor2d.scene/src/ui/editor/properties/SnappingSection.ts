namespace phasereditor2d.scene.ui.editor.properties {

    import controls = colibri.ui.controls;

    export class SnappingSection extends SceneSection {

        constructor(page: controls.properties.PropertyPage) {
            super(page, "phasereditor2d.scene.ui.editor.properties.SnappingSection", "Snapping");
        }

        createForm(parent: HTMLDivElement) {

            const comp = this.createGridElement(parent, 3);

            comp.style.gridTemplateColumns = "auto auto 1fr auto 1fr";

            {

                const label = this.createLabel(comp, "Enabled", "Enable snapping");
                label.style.gridColumn = "1 / span 2";

                this.createBooleanField(comp, "snapEnabled", label)
                    .style.gridColumn = "3 / span 3";
            }

            this.createLabel(comp, "Size");
            this.createIntegerField(comp, "snapWidth", "Width", "Scene snapping width.");
            this.createIntegerField(comp, "snapHeight", "Height", "Scene snapping height.");
        }

        protected getSectionHelpPath() {
            return "scene-editor/snapping-properties.html";
        }
    }
}