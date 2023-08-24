namespace phasereditor2d.pack.core {

    import controls = colibri.ui.controls;
    import ide = colibri.ui.ide;

    export class SpineJsonAssetPackItem extends AssetPackItem {

        constructor(pack: AssetPack, data: any) {
            super(pack, data);
        }

        async preload(): Promise<controls.PreloadResult> {

            const file = this.getDataFile();

            if (file) {

                return await ide.FileUtils.preloadFileString(file);
            }

            return controls.PreloadResult.NOTHING_LOADED;
        }

        getDataFile() {

            const url = this.getData().url;

            const file = this.getFileFromAssetUrl(url);

            return file;
        }

        getDataString() {

            const file = this.getDataFile();

            if (file) {

                return ide.FileUtils.getFileString(file);
            }

            return undefined;
        }

        buildSkeleton(atlasAsset: SpineAtlasAssetPackItem) {

            const spineData = this.getDataString();

            const atlas = atlasAsset.getSpineTextureAtlas();

            if (spineData && atlas) {

                const skel = new spine.SkeletonJson(new spine.AtlasAttachmentLoader(atlas));

                const data = skel.readSkeletonData(spineData);

                return data;
            }

            return undefined;
        }

        addToPhaserCache(game: Phaser.Game, cache: parsers.AssetPackCache): void {

            const url = this.getData().url;

            const file = this.getFileFromAssetUrl(url);

            if (file) {

                const str = ide.FileUtils.getFileString(file);

                game.cache.json.add(this.getKey(), str);
            }

            cache.addAsset(this);
        }
    }
}