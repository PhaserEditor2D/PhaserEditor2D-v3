namespace phasereditor2d.scene.ui.sceneobjects {

    import controls = colibri.ui.controls;

    export class TilemapSection extends editor.properties.BaseSceneSection<Tilemap> {

        constructor(page: controls.properties.PropertyPage) {
            super(page, "phasereditor2d.scene.ui.sceneobjects.TilemapSection", "Tilemap", false, false);
        }

        protected getSectionHelpPath() {

            return "scene-editor/tilemap-object.html";
        }

        createForm(parent: HTMLDivElement) {

            const docs = ScenePlugin.getInstance().getPhaserDocs();

            const comp = this.createGridElement(parent, 2);

            {
                this.createLabel(comp, "Asset Key", docs.getDoc("Phaser.GameObjects.GameObjectFactory.tilemap(key)"));

                const text = this.createText(comp, true);

                this.addUpdater(() => {

                    text.value = this.getSelectionFirstElement().getTilemapAssetKey()
                });
            }

            {
                this.createLabel(comp, "Tile Width", docs.getDoc("Phaser.Tilemaps.Tilemap.tileWidth"));

                const text = this.createText(comp, true);

                this.addUpdater(() => {

                    text.value = this.getSelectionFirstElement().tileWidth.toString();
                });
            }

            {
                this.createLabel(comp, "Tile Height", docs.getDoc("Phaser.Tilemaps.Tilemap.tileHeight"));

                const text = this.createText(comp, true);

                this.addUpdater(() => {

                    text.value = this.getSelectionFirstElement().tileHeight.toString();
                });
            }
        }

        canEdit(obj: any, n: number): boolean {

            return obj instanceof Tilemap;
        }

        canEditNumber(n: number): boolean {

            return n === 1;
        }
    }
}