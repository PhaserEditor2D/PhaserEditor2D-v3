namespace phasereditor2d.scene.ui.sceneobjects {

    import controls = colibri.ui.controls;

    export class SpineSkeletonDataSection extends controls.properties.PropertySection<pack.core.SpineAssetPackItem | pack.core.SpineSkinItem> {

        constructor(page: controls.properties.PropertyPage) {
            super(page, "phasereditor2d.scene.ui.sceneobjects.SpineSkeletonDataSection", "Spine Skeleton", false, false);
        }

        hasMenu(): boolean {
            
            return true;
        }

        createMenu(menu: controls.Menu): void {
            
            super.createMenu(menu);

            ide.IDEPlugin.getInstance().createHelpMenuItem(menu, "scene-editor/spine-animations-assets-preview.html");
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

                    const asset = this.getSpineAsset();

                    const atlas = asset.guessAtlasAsset();

                    text.value = atlas ? atlas.getKey() : `Not found "${asset.getKey()}-atlas"`;
                });
            }

            {
                // preview animations

                const btn = this.createButton(comp, "Preview Animations", async () => {

                    const asset = this.getSpineAsset();

                    const atlas = asset.guessAtlasAsset();

                    if (!atlas) {

                        alert(`Cannot find an atlas file for this skeleton.`
                            + `Please, add a "spineAtlas" file to the Asset Pack.` 
                            + `Use the key <code>${asset.getKey()}-atlas</code>.`);

                        return;
                    }

                    await asset.preload();

                    await atlas.preload();

                    await atlas.preloadImages();

                    const dlg = new SpinePreviewDialog(asset, atlas, this.getSkinName());

                    dlg.create();
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