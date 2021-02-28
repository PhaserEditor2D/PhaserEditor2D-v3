/// <reference path="./BaseSection.ts" />

namespace phasereditor2d.pack.ui.editor.properties {

    import controls = colibri.ui.controls;

    export class SVGSection extends BaseSection {

        constructor(page: controls.properties.PropertyPage) {
            super(page, "phasereditor2d.pack.ui.editor.properties.SVGSection", "SVG", core.SVG_TYPE);
        }

        canEdit(obj: any, n: number) {
            return super.canEdit(obj, n) && obj instanceof core.SvgAssetPackItem;
        }

        createForm(parent: HTMLDivElement) {

            const comp = this.createGridElement(parent, 3);

            comp.style.gridTemplateColumns = "auto 1fr auto";

            this.createFileField(comp, "URL", "url", webContentTypes.core.CONTENT_TYPE_SVG,
                "Phaser.Loader.LoaderPlugin.svg(url)");

                this.createSimpleIntegerField(comp, "Scale", "svgConfig.scale",
                "Phaser.Types.Loader.FileTypes.SVGSizeConfig.scale");

            this.createSimpleIntegerField(comp, "Width", "svgConfig.width",
                "Phaser.Types.Loader.FileTypes.SVGSizeConfig.width");

            this.createSimpleIntegerField(comp, "Height", "svgConfig.height",
                "Phaser.Types.Loader.FileTypes.SVGSizeConfig.height");
        }
    }
}