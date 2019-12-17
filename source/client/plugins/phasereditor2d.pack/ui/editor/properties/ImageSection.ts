namespace phasereditor2d.pack.ui.editor.properties {

    import controls = colibri.ui.controls;

    export class ImageSection extends BaseSection {

        constructor(page: controls.properties.PropertyPage) {
            super(page, "phasereditor2d.pack.ui.editor.properties.ImageSection", "Image");
        }

        canEdit(obj: any, n: number) {
            return obj instanceof core.ImageAssetPackItem && super.canEdit(obj, n);
        }

        protected createForm(parent: HTMLDivElement) {
            const comp = this.createGridElement(parent, 3);

            comp.style.gridTemplateColumns = "auto 1fr auto";

            this.createFileField(comp, "URL", "url", webContentTypes.core.CONTENT_TYPE_IMAGE);

            this.createFileField(comp, "Normal Map", "normalMap", webContentTypes.core.CONTENT_TYPE_IMAGE);
        }
    }
}