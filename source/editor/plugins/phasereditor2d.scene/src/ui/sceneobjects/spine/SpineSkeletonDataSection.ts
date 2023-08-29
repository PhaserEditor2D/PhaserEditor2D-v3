namespace phasereditor2d.scene.ui.sceneobjects {

    import controls = colibri.ui.controls;

    export class SpineSkeletonDataSection extends controls.properties.PropertySection<pack.core.SpineAssetPackItem | pack.core.SpineSkinItem> {

        constructor(page: controls.properties.PropertyPage) {
            super(page, "phasereditor2d.scene.ui.sceneobjects.SpineSkeletonDataSection", "Spine Skeleton", false, false);
        }

        createForm(parent: HTMLDivElement): void {

            const comp = this.createGridElement(parent, 2);


            {
                // key

                this.createLabel(comp, "Skeleton Key");

                const text = this.createText(comp, true);

                this.addUpdater(() => {

                    text.value = this.getSpineAsset().getKey();
                });
            }

            {
                // atlas

                this.createLabel(comp, "Atlas Key");

                const text = this.createText(comp, true);

                this.addUpdater(() => {

                    text.value = this.getSpineAsset().guessAtlasAsset().getKey();
                });
            }

            {
                // preview animations

                const btn = this.createButton(comp, "Preview Animations", () => {

                    const dlg = new SpinePreviewDialog();
                    
                    dlg.create();

                    const asset = this.getSpineAsset();

                    dlg.previewSpine(asset, asset.guessAtlasAsset(), this.getSkinName());
                });

                btn.style.gridColumn = "1 / span 2";
            }
        }

        private getSpineAsset() {

            const obj = this.getSelectionFirstElement();

            if (obj instanceof pack.core.SpineAssetPackItem) {

                return obj;
            }

            return obj.spineAsset;
        }

        private getSkinName() {

            const obj = this.getSelectionFirstElement();

            if (obj instanceof pack.core.SpineSkinItem) {

                return obj.skinName;
            }

            return null;
        }

        canEdit(obj: any, n: number): boolean {

            return obj instanceof pack.core.SpineAssetPackItem || obj instanceof pack.core.SpineSkinItem;
        }

        canEditNumber(n: number): boolean {

            return n === 1;
        }
    }
}