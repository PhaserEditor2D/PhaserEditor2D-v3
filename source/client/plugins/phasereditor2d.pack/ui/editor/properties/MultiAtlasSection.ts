/// <reference path="./BaseSection.ts" />

namespace phasereditor2d.pack.ui.editor.properties {

    import controls = colibri.ui.controls;

    export class MultiatlasSection extends BaseSection {

        constructor(page : controls.properties.PropertyPage) {
            super(page, "phasereditor2d.pack.ui.editor.properties.MultiatlasSection", "Multiatlas");
        }

        canEdit(obj : any, n : number) {
            return super.canEdit(obj, n) && obj instanceof core.MultiatlasAssetPackItem;
        }

        protected createForm(parent: HTMLDivElement) {

            const comp = this.createGridElement(parent, 3);

            comp.style.gridTemplateColumns = "auto 1fr auto";

            this.createFileField(comp, "URL", "url", core.contentTypes.CONTENT_TYPE_MULTI_ATLAS);

            this.createSimpleTextField(comp, "Path", "path");
        }
    }
}