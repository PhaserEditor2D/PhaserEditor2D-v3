namespace phasereditor2d.pack.ui.properties {

    import controls = colibri.ui.controls;

    export class AtlasFrameInfoSection extends controls.properties.PropertySection<core.AssetPackImageFrame|core.ImageAssetPackItem> {

        constructor(page: controls.properties.PropertyPage) {
            super(page, "phasereditor2d.pack.ui.properties.AtlasFrameInfoSection", "Frame Info", false);
        }

        createForm(parent: HTMLDivElement) {

            const comp = this.createGridElement(parent, 2);

            {
                // Key

                this.createLabel(comp, "Name", "Frame name");

                const text = this.createText(comp, true);

                this.addUpdater(() => {

                    text.value = this.getFrame().getName().toString();
                });
            }

            {
                // Width

                this.createLabel(comp, "Width", "Frame width");

                const text = this.createText(comp, true);

                this.addUpdater(() => {

                    text.value = this.getFrame().getWidth().toString();
                });
            }

            {
                // Height

                this.createLabel(comp, "Height", "Frame height");

                const text = this.createText(comp, true);

                this.addUpdater(() => {

                    text.value = this.getFrame().getHeight().toString();
                });
            }
        }

        private getFrame(): core.AssetPackImageFrame {

            const obj = this.getSelectionFirstElement();

            if (obj instanceof core.ImageAssetPackItem) {

                return obj.getFrames()[0];
            }

            return obj;
        }

        canEdit(obj: any): boolean {

            return obj instanceof core.AssetPackImageFrame || obj instanceof core.ImageAssetPackItem;
        }

        canEditNumber(n: number): boolean {

            return n === 1;
        }

    }

}