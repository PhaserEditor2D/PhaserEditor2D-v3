/// <reference path="./BaseSection.ts" />

namespace phasereditor2d.pack.ui.editor.properties {

    import controls = colibri.ui.controls;

    export class AtlasSection extends BaseSection {

        constructor(page: controls.properties.PropertyPage) {
            super(page, "phasereditor2d.pack.ui.editor.properties.AtlasSection", "Atlas", core.ATLAS_TYPE);
        }

        canEdit(obj: any, n: number) {

            return super.canEdit(obj, n) && obj instanceof core.AtlasAssetPackItem;
        }

        createForm(parent: HTMLDivElement) {
            
            const comp = this.createGridElement(parent, 3);

            comp.style.gridTemplateColumns = "auto 1fr auto";

            this.createFileField(comp, "Atlas URL", "atlasURL", core.contentTypes.CONTENT_TYPE_ATLAS,
                "Phaser.Loader.LoaderPlugin.atlas(atlasURL)");

            this.createFileField(comp, "Texture URL", "textureURL", webContentTypes.core.CONTENT_TYPE_IMAGE,
                "Phaser.Loader.LoaderPlugin.atlas(textureURL)");

            this.createFileField(comp, "Normal Map", "normalMap", webContentTypes.core.CONTENT_TYPE_IMAGE,
                "Phaser.Types.Loader.FileTypes.AtlasJSONFileConfig.normalMap");
        }
    }
}