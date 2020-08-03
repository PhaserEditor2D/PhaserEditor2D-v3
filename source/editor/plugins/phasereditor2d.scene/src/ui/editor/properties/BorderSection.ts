/// <reference path="./SceneSection.ts" />

namespace phasereditor2d.scene.ui.editor.properties {

    import controls = colibri.ui.controls;

    export class BorderSection extends SceneSection {

        constructor(page: controls.properties.PropertyPage) {
            super(page, "phasereditor2d.scene.ui.editor.properties.DisplaySection", "Border", false, true);
        }
        protected getSectionHelpPath() {
            return "scene-editor/border-properties.html";
        }

        createForm(parent: HTMLDivElement) {

            const comp = this.createGridElement(parent, 3);

            comp.style.gridTemplateColumns = "auto auto 1fr auto 1fr";

            this.createLabel(comp, "Border");
            this.createIntegerField(comp, "borderX", "X", "Scene border position (X)");
            this.createIntegerField(comp, "borderY", "Y", "Scene border position (Y)");

            this.createLabel(comp, "");
            this.createIntegerField(comp, "borderWidth", "Width", "Scene border width");
            this.createIntegerField(comp, "borderHeight", "Height", "Scene border height");
        }
    }
}