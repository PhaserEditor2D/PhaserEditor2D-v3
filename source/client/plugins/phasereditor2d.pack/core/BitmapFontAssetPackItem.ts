namespace phasereditor2d.pack.core {

    import controls = colibri.ui.controls;
    import io = colibri.core.io;

    export class BitmapFontAssetPackItem extends AssetPackItem {

        constructor(pack: AssetPack, data: any) {
            super(pack, data);
        }

        async preload() {

            const dataUrl = this.getData().fontDataURL;

            if (dataUrl) {

                const file = pack.core.AssetPackUtils.getFileFromPackUrl(dataUrl);

                if (file) {

                    return colibri.ui.ide.FileUtils.preloadFileString(file);
                }
            }

            return controls.Controls.resolveNothingLoaded();
        }

        private createImageAsset() {
            
            const data = this.getData();

            const imageAsset = new ImageAssetPackItem(this.getPack(), {
                key: this.getKey(),
                url: data.textureURL,
                normalMap: data.normalMap
            });

            return imageAsset;
        }

        async preloadImages() {

            const imageAsset = this.createImageAsset();

            return imageAsset.preloadImages();
        }

        computeUsedFiles(files: Set<io.FilePath>) {

            super.computeUsedFiles(files);

            this.addFilesFromDataKey(files, "fontDataURL", "textureURL");
        }

        addToPhaserCache(game: Phaser.Game, cache: parsers.AssetPackCache) {

            const imageAsset = this.createImageAsset();

            imageAsset.addToPhaserCache(game, cache);

            const key = this.getKey();

            const xmlFile = pack.core.AssetPackUtils.getFileFromPackUrl(this.getData().fontDataURL);

            if (!xmlFile) {

                return;
            }

            const xmlString = colibri.ui.ide.FileUtils.getFileString(xmlFile);

            if (!xmlString) {

                return;
            }

            const xmlDoc = Phaser.DOM.ParseXML(xmlString);
            const xmlData = Phaser.GameObjects.BitmapText.ParseXMLBitmapFont(xmlDoc as any);

            game.cache.bitmapFont.add(key, {
                data: xmlData,
                texture: key,
                frame: null
            });

            cache.addAsset(this);
        }
    }
}