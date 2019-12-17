/// <reference path="./BaseSection.ts" />

namespace phasereditor2d.pack.ui.editor.properties {

    import controls = colibri.ui.controls;

    export class ScenePluginSection extends BaseSection {

        constructor(page : controls.properties.PropertyPage) {
            super(page, "phasereditor2d.pack.ui.editor.properties.ScenePluginSection", "Scene Plugin");
        }

        canEdit(obj : any, n : number) {
            return super.canEdit(obj, n) && obj instanceof core.ScenePluginAssetPackItem;
        }

        protected createForm(parent: HTMLDivElement) {

            const comp = this.createGridElement(parent, 3);

            comp.style.gridTemplateColumns = "auto 1fr auto";

            this.createFileField(comp, "URL", "url", webContentTypes.core.CONTENT_TYPE_JAVASCRIPT);

            this.createSimpleTextField(comp, "System Key", "systemKey");

            this.createSimpleTextField(comp, "Scene Key", "sceneKey");
        }
    }
}