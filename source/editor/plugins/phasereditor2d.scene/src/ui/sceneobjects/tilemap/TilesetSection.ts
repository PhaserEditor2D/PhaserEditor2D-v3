namespace phasereditor2d.scene.ui.sceneobjects {

    import controls = colibri.ui.controls;

    export class TilesetSection extends editor.properties.BaseSceneSection<Phaser.Tilemaps.Tileset> {

        constructor(page: controls.properties.PropertyPage) {
            super(page, "phasereditor2d.scene.ui.sceneobjects.TilesetSection2", "Tileset", false, false);
        }

        createForm(parent: HTMLDivElement) {

            // TODO: missing tooltips

            const comp = this.createGridElement(parent, 2);

            {
                this.createLabel(comp, "Name");

                const text = this.createText(comp, true);

                this.addUpdater(() => {

                    text.value = this.getSelectionFirstElement().name;
                });
            }

            {
                this.createLabel(comp, "Image");

                const btn = this.createButton(comp, "", () => this.selectImage());

                this.addUpdater(() => {

                    let text = "";

                    const image = this.getSelectionFirstElement().image;

                    if (image) {

                        text = image.key;
                    }

                    btn.textContent = text;
                });
            }

            {
                this.createLabel(comp, "Tile Width");

                const text = this.createText(comp, true);

                this.addUpdater(() => {

                    text.value = this.getSelectionFirstElement().tileWidth.toString();
                });
            }

            {
                this.createLabel(comp, "Tile Height");

                const text = this.createText(comp, true);

                this.addUpdater(() => {

                    text.value = this.getSelectionFirstElement().tileHeight.toString();
                });
            }
        }

        private async selectImage() {

            const finder = new pack.core.PackFinder();

            await finder.preload();

            const dlg = new pack.ui.dialogs.AssetSelectionDialog("tree");

            dlg.create();

            dlg.getViewer().setInput(finder.getAssets(i => i instanceof pack.core.ImageAssetPackItem));

            dlg.setSelectionCallback(async (sel) => {

                const editor = this.getEditor();

                const scene = this.getEditor().getScene();

                const imageAsset = sel[0] as pack.core.ImageAssetPackItem;

                const textures = scene.sys.textures;

                const imageKey = imageAsset.getKey();

                let texture: Phaser.Textures.Texture;

                if (textures.exists(imageKey)) {

                    texture = textures.get(imageKey);

                } else {

                    const loaderExt = ScenePlugin.getInstance().getLoaderUpdaterForAsset(imageAsset);

                    await loaderExt.updateLoader(scene, imageAsset);

                    texture = textures.get(imageKey);
                }

                editor.getUndoManager().add(
                    new ui.editor.undo.SceneSnapshotOperation(editor, async () => {
                        this.getSelectionFirstElement().setImage(texture);
                    }));
            });
        }

        canEdit(obj: any, n: number): boolean {

            return obj instanceof Phaser.Tilemaps.Tileset;
        }

        canEditNumber(n: number): boolean {

            return n === 1;
        }
    }
}