namespace phasereditor2d.pack.ui.editor.properties {

    import controls = colibri.ui.controls;

    export class ImageSection extends BaseSection {

        constructor(page: controls.properties.PropertyPage) {
            super(page, "phasereditor2d.pack.ui.editor.properties.ImageSection", "Image", core.IMAGE_TYPE);
        }

        canEdit(obj: any, n: number) {

            return obj instanceof core.ImageAssetPackItem && !(obj instanceof core.SvgAssetPackItem) && super.canEdit(obj, n);
        }

        createForm(parent: HTMLDivElement) {

            const comp = this.createGridElement(parent, 3);

            comp.style.gridTemplateColumns = "auto 1fr auto";

            this.createFileField(comp, "URL", "url", webContentTypes.core.CONTENT_TYPE_IMAGE,
                "Phaser.Loader.LoaderPlugin.image(url)");

            this.createFileField(comp, "Normal Map", "normalMap", webContentTypes.core.CONTENT_TYPE_IMAGE,
                "Phaser.Types.Loader.FileTypes.ImageFileConfig.normalMap");
        }
    }
}