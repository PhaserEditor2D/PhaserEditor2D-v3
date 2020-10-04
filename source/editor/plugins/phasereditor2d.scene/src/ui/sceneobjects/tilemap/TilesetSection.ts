namespace phasereditor2d.scene.ui.sceneobjects {

    import controls = colibri.ui.controls;

    export class TilesetSection extends editor.properties.BaseSceneSection<Tilemap> {

        constructor(page: controls.properties.PropertyPage) {
            super(page, "phasereditor2d.scene.ui.sceneobjects.TilesetSection", "Tilesets", false, false);
        }

        createForm(parent: HTMLDivElement) {

            const comp = this.createGridElement(parent, 1);

            const viewerContainer = document.createElement("div");
            viewerContainer.style.display = "grid";
            viewerContainer.style.gridTemplateColumns = "1fr";
            viewerContainer.style.height = "200px";

            comp.appendChild(viewerContainer);

            const viewer = this.createViewer();

            const filteredViewer = new colibri.ui.ide.properties.FilteredViewerInPropertySection(this.getPage(), viewer, true);

            viewerContainer.appendChild(filteredViewer.getElement());

            this.addUpdater(async () => {

                const tilemap = this.getSelectionFirstElement();

                viewer.setInput(tilemap.tilesets);
                viewer.setSelection([]);

                filteredViewer.layout();
                viewer.repaint();
            });

            const buttonPanel = document.createElement("div");

            const setImageButton = this.createButton(buttonPanel, "Set Image", async () => {

                const finder = new pack.core.PackFinder();

                await finder.preload();

                const dlg = new pack.ui.dialogs.AssetSelectionDialog("tree");

                dlg.create();

                dlg.getViewer().setInput(finder.getAssets(i => i instanceof pack.core.ImageAssetPackItem));

                dlg.setSelectionCallback(async (sel) => {

                    const scene = this.getEditor().getScene();

                    const textures = scene.sys.textures;

                    const imageItem = sel[0] as pack.core.ImageAssetPackItem;

                    const imageKey = imageItem.getKey();

                    const tilemap = this.getSelectionFirstElement();

                    const tilesetData = viewer.getSelectionFirstElement() as pack.core.ITilesetData;

                    let texture: Phaser.Textures.Texture;

                    if (textures.exists(imageKey)) {

                        texture = textures.get(imageKey);

                    } else {

                        const loaderExt = ScenePlugin.getInstance().getLoaderUpdaterForAsset(imageItem);

                        await loaderExt.updateLoader(scene, imageItem);

                        texture = textures.get(imageKey);
                    }

                    const tileset = tilemap.getTileset(tilesetData.name);

                    if (tileset) {

                        tileset.setImage(texture);

                    } else {

                        alert(`Tileset ${tilesetData.name} not found.`);
                    }

                    viewer.repaint();
                });
            });

            setImageButton.disabled = true;

            setImageButton.style.float = "right";

            viewer.eventSelectionChanged.addListener(() => {

                const sel = viewer.getSelection();

                setImageButton.disabled = sel.length !== 1;
            });

            comp.appendChild(buttonPanel);
        }

        private createViewer() {

            const viewer = new controls.viewers.TreeViewer("phasereditor2d.scene.ui.sceneobjects.TilesetSection");
            viewer.setLabelProvider(
                new controls.viewers.LabelProvider(
                    (data: pack.core.ITilesetData) => data.name));

            viewer.setContentProvider(new controls.viewers.ArrayTreeContentProvider());

            viewer.setCellRendererProvider(new controls.viewers.EmptyCellRendererProvider(
                (tileset: Phaser.Tilemaps.Tileset) => {

                    const tilesetImage = tileset.image;

                    if (tilesetImage) {

                        const key = tilesetImage.key;

                        const image = this.getEditor().getScene().getPackCache().getImage(key);

                        if (image) {

                            return new controls.viewers.ImageCellRenderer(image);
                        }
                    }

                    return new controls.viewers.EmptyCellRenderer(false);
                }));

            viewer.setTreeRenderer(new controls.viewers.TreeViewerRenderer(viewer));

            viewer.setInput([]);

            return viewer;
        }

        canEdit(obj: any, n: number): boolean {

            return obj instanceof Tilemap;
        }

        canEditNumber(n: number): boolean {

            return n === 1;
        }
    }
}