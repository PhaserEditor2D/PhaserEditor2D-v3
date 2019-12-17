/// <reference path="./BaseSection.ts" />

namespace phasereditor2d.pack.ui.editor.properties {

    import controls = colibri.ui.controls;
    import json = colibri.core.json;

    export class SpritesheetFrameSection extends BaseSection {

        constructor(page: controls.properties.PropertyPage) {
            super(page, "phasereditor2d.pack.ui.editor.properties.SpritesheetFrameSection", "Spritesheet Frame");
        }

        canEdit(obj: any, n: number) {
            return obj instanceof core.SpritesheetAssetPackItem;
        }

        canEditNumber(n : number) {
            return n > 0;
        }

        protected createForm(parent: HTMLDivElement) {

            const comp = this.createGridElement(parent, 3);

            comp.style.gridTemplateColumns = "auto 1fr auto";

            this.createSimpleIntegerField(comp, "Frame Width", "frameConfig.frameWidth");

            this.createSimpleIntegerField(comp, "Frame Height", "frameConfig.frameHeight");

            this.createSimpleIntegerField(comp, "Start Frame", "frameConfig.startFrame");

            this.createSimpleIntegerField(comp, "End Frame", "frameConfig.endFrame");

            this.createSimpleIntegerField(comp, "Margin", "frameConfig.margin");

            this.createSimpleIntegerField(comp, "Spacing", "frameConfig.spacing");
        }
    }
}