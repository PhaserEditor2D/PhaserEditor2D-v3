namespace phasereditor2d.scene.ui.sceneobjects {

    import controls = colibri.ui.controls;

    export class TilesetPreviewSection extends editor.properties.BaseSceneSection<Phaser.Tilemaps.Tileset> {

        constructor(page: controls.properties.PropertyPage) {
            super(page, "phasereditor2d.scene.ui.sceneobjects.TilesetPreviewSection", "Tileset Preview", true, false);
        }

        createForm(parent: HTMLDivElement) {

            colibri.ui.ide.properties.BaseImagePreviewSection.createSectionForm(
                parent, this, () => this.getSelectedImage());
        }

        hasMenu() {

            return false;
        }

        private getSelectedImage(): controls.IImage {

            const tileset = this.getSelectionFirstElement();

            if (tileset.image) {

                const key = tileset.image.key;

                const tilemap = Tilemap.getTilemapFromTileset(tileset);

                if (tilemap) {

                    const scene = tilemap.scene as Scene;

                    return scene.getPackCache().getImage(key) || scene.getPackCache().getSpritesheetImage(key);
                }
            }

            return null;
        }

        canEdit(obj: any, n: number): boolean {

            return obj instanceof Phaser.Tilemaps.Tileset;
        }

        canEditNumber(n: number): boolean {

            return n === 1;
        }
    }
}