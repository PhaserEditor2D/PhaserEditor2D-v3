/// <reference path="./BaseSection.ts" />

namespace phasereditor2d.pack.ui.editor.properties {

    import controls = colibri.ui.controls;

    export class AsepriteSection extends BaseSection {

        constructor(page: controls.properties.PropertyPage) {
            super(page, "phasereditor2d.pack.ui.editor.properties.AsepriteSection", "Aseprite", core.ASEPRITE_TYPE);
        }

        canEdit(obj: any, n: number) {

            return super.canEdit(obj, n) && obj instanceof core.AsepriteAssetPackItem;
        }

        createForm(parent: HTMLDivElement) {
            
            const comp = this.createGridElement(parent, 3);

            comp.style.gridTemplateColumns = "auto 1fr auto";

            this.createFileField(comp, "Atlas URL", "atlasURL", core.contentTypes.CONTENT_TYPE_ASEPRITE,
                "Phaser.Loader.LoaderPlugin.aseprite(atlasURL)");

            this.createFileField(comp, "Texture URL", "textureURL", webContentTypes.core.CONTENT_TYPE_IMAGE,
                "Phaser.Loader.LoaderPlugin.aseprite(textureURL)");

            this.createFileField(comp, "Normal Map", "normalMap", webContentTypes.core.CONTENT_TYPE_IMAGE,
                "Phaser.Types.Loader.FileTypes.AtlasJSONFileConfig.normalMap");
        }
    }
}