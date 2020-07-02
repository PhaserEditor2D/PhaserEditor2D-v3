/// <reference path="./BaseSection.ts" />

namespace phasereditor2d.pack.ui.editor.properties {

    import controls = colibri.ui.controls;

    export class MultiatlasSection extends BaseSection {

        constructor(page: controls.properties.PropertyPage) {
            super(page, "phasereditor2d.pack.ui.editor.properties.MultiatlasSection", "Multiatlas", core.MULTI_ATLAS_TYPE);
        }

        canEdit(obj: any, n: number) {
            return super.canEdit(obj, n) && obj instanceof core.MultiatlasAssetPackItem;
        }

        createForm(parent: HTMLDivElement) {

            const comp = this.createGridElement(parent, 3);

            comp.style.gridTemplateColumns = "auto 1fr auto";

            this.createFileField(comp, "URL", "url", core.contentTypes.CONTENT_TYPE_MULTI_ATLAS,
                "Phaser.Loader.LoaderPlugin.multiatlas(atlasURL)");

            this.createSimpleTextField(comp, "Path", "path", "Phaser.Loader.LoaderPlugin.multiatlas(path)");
        }
    }
}