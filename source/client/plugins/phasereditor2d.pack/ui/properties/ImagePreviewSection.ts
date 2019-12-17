namespace phasereditor2d.pack.ui.properties {
    
    import controls = colibri.ui.controls;
    import ide = colibri.ui.ide;

    export class ImagePreviewSection extends controls.properties.PropertySection<core.AssetPackItem> {

        constructor(page: controls.properties.PropertyPage) {
            super(page, "pack.ImageSection", "Image Preview", true);
        }

        protected createForm(parent: HTMLDivElement) {
            parent.classList.add("ImagePreviewFormArea", "PreviewBackground");

            const imgControl = new controls.ImageControl(ide.IMG_SECTION_PADDING);

            this.getPage().addEventListener(controls.EVENT_CONTROL_LAYOUT, (e: CustomEvent) => {
                imgControl.resizeTo();
            })

            parent.appendChild(imgControl.getElement());
            setTimeout(() => imgControl.resizeTo(), 1);

            this.addUpdater(() => {
                const obj = this.getSelection()[0];
                let img: controls.IImage;
                if (obj instanceof core.AssetPackItem) {
                    img = core.AssetPackUtils.getImageFromPackUrl(obj.getData().url);
                } else {
                    img = obj;
                }
                imgControl.setImage(img);
                setTimeout(() => imgControl.resizeTo(), 1);
            });
        }

        canEdit(obj: any): boolean {
            return obj instanceof core.AssetPackItem && obj.getType() === "image" || obj instanceof controls.ImageFrame;
        }

        canEditNumber(n: number): boolean {
            return n === 1;
        }


    }

}