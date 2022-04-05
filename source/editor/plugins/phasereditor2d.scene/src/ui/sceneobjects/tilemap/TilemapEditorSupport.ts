namespace phasereditor2d.scene.ui.sceneobjects {

    export interface ITilemapData extends core.json.IScenePlainObjectData {

        key: string;
        tilesets: Array<{
            name: string;
            imageKey?: string;
        }>;
    }

    export class TilemapEditorSupport extends ScenePlainObjectEditorSupport<Tilemap> {

        constructor(scene: Scene, obj: Tilemap) {
            super(TilemapExtension.getInstance(), obj, scene);

            this.setLabel(obj.getTilemapAssetKey());
        }

        writeJSON(data: ITilemapData) {

            super.writeJSON(data)

            const tilemap = this.getObject();

            data.key = tilemap.getTilemapAssetKey();

            data.tilesets = [];

            for (const tileset of tilemap.tilesets) {

                data.tilesets.push({
                    name: tileset.name,
                    imageKey: tileset.image ? tileset.image.key : undefined
                });
            }
        }

        readJSON(data: ITilemapData) {

            super.readJSON(data);

            const scene = this.getScene();

            const textures = scene.sys.textures;

            const tilemap = this.getObject();

            for (const tileset of tilemap.tilesets) {

                const tilesetData = data.tilesets.find(t => t.name === tileset.name)

                if (tilesetData && tilesetData.imageKey) {

                    const imageKey = tilesetData.imageKey;

                    if (textures.exists(imageKey)) {

                        tileset.setImage(textures.get(imageKey));
                    }
                }
            }
        }

        destroy() {

            const tilemap = this.getObject();

            const layers: TilemapLayer[] = [];

            this.getScene().visitAll(obj => {

                if (obj instanceof TilemapLayer) {

                    if (obj.tilemap === tilemap) {

                        layers.push(obj);
                    }
                }
            });

            for (const layer of layers) {

                layer.getEditorSupport().destroy();
            }

            tilemap.destroy();
        }

        async buildDependencyHash(args: IBuildDependencyHashArgs) {
            //
        }
    }
}