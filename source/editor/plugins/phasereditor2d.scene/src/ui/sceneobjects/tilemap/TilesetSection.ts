namespace phasereditor2d.scene.ui.sceneobjects {

    import controls = colibri.ui.controls;

    export class TilesetSection extends editor.properties.BaseSceneSection<Phaser.Tilemaps.Tileset> {

        constructor(page: controls.properties.PropertyPage) {
            super(page, "phasereditor2d.scene.ui.sceneobjects.TilesetSection2", "Tileset", false, false);
        }

        createForm(parent: HTMLDivElement) {

            const comp = this.createGridElement(parent, 2);

            this.simpleProperty(comp, "name", "Name");

            {
                this.createLabel(comp, "Image", this.help("image"));

                const btn = this.createButton(comp, "", () => this.selectImage());

                this.addUpdater(() => {

                    let text = "Select Image...";

                    const image = this.getSelectionFirstElement().image;

                    if (image) {

                        text = image.key;
                    }

                    btn.textContent = text;
                });

                controls.Tooltip.tooltip(btn, "Select a new image for this tileset.");
            }

            this.simpleProperty(comp, "tileWidth", "Tile Width");

            this.simpleProperty(comp, "tileHeight", "Tile Height");

            this.simpleProperty(comp, "tileMargin", "Tile Margin");

            this.simpleProperty(comp, "tileSpacing", "Tile Spacing");
        }

        private help(prop: string) {

            return ScenePlugin.getInstance().getPhaserDocs().getDoc("Phaser.Tilemaps.Tileset." + prop);
        }

        private simpleProperty(comp: HTMLElement, prop: string, name: string) {

            this.createLabel(comp, name, this.help(prop));

            const text = this.createText(comp, true);

            this.addUpdater(() => {

                const tileset = this.getSelectionFirstElement();

                text.value = tileset[prop].toString();
            });
        }

        private async selectImage() {

            const finder = new pack.core.PackFinder();

            await finder.preload();

            const dlg = new pack.ui.dialogs.AssetSelectionDialog("tree");

            dlg.create();

            dlg.getViewer().setInput(finder.getAssets(i => i instanceof pack.core.ImageAssetPackItem
                || i instanceof pack.core.SpritesheetAssetPackItem));

            dlg.setSelectionCallback(async (sel) => {

                const editor = this.getEditor();

                const scene = this.getEditor().getScene();

                const imageAsset = sel[0] as (pack.core.ImageAssetPackItem | pack.core.SpritesheetAssetPackItem);

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

                        const tileset = this.getSelectionFirstElement();

                        tileset.setImage(texture);

                        this.getEditor().refreshScene();
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