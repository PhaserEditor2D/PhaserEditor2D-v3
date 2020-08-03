namespace phasereditor2d.pack.ui.editor.properties {

    import controls = colibri.ui.controls;

    export class VideoSection extends BaseSection {

        constructor(page: controls.properties.PropertyPage) {
            super(page, "phasereditor2d.pack.ui.editor.properties.VideoSection", "Video", core.VIDEO_TYPE);
        }

        canEdit(obj: any, n: number) {
            return super.canEdit(obj, n) && obj instanceof core.VideoAssetPackItem;
        }

        createForm(parent: HTMLDivElement) {

            const comp = this.createGridElement(parent, 3);

            comp.style.gridTemplateColumns = "auto 1fr auto";

            this.createMultiFileField(comp, "URL", "url", webContentTypes.core.CONTENT_TYPE_VIDEO,
                "Phaser.Loader.LoaderPlugin.video(urls)");
        }
    }
}