/// <reference path="./BaseSection.ts" />

namespace phasereditor2d.pack.ui.editor.properties {

    import controls = colibri.ui.controls;
    import json = colibri.core.json;

    export class SpritesheetURLSection extends BaseSection {

        constructor(page: controls.properties.PropertyPage) {
            super(page, "phasereditor2d.pack.ui.editor.properties.SpritesheetURLSection", "Spritesheet URL", core.SPRITESHEET_TYPE);
        }

        canEdit(obj: any, n: number) {
            return super.canEdit(obj, n) && obj instanceof core.SpritesheetAssetPackItem;
        }

        createForm(parent: HTMLDivElement) {

            const comp = this.createGridElement(parent, 3);

            comp.style.gridTemplateColumns = "auto 1fr auto";

            this.createFileField(comp, "URL", "url", webContentTypes.core.CONTENT_TYPE_IMAGE,
                "Phaser.Loader.LoaderPlugin.spritesheet(url)");

        }
    }
}