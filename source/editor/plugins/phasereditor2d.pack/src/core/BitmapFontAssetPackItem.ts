namespace phasereditor2d.pack.core {

    import controls = colibri.ui.controls;
    import io = colibri.core.io;

    export class BitmapFontAssetPackItem extends AssetPackItem {

        private _fontData: IBitmapFontData;

        constructor(pack: AssetPack, data: any) {
            super(pack, data);
        }

        async preload() {

            const dataUrl = this.getData().fontDataURL;

            if (dataUrl) {

                const file = this.getFileFromAssetUrl(dataUrl);

                if (file) {

                    const result = await colibri.ui.ide.FileUtils.preloadFileString(file);

                    if (this._fontData === undefined || result === controls.PreloadResult.RESOURCES_LOADED) {

                        const str = colibri.ui.ide.FileUtils.getFileString(file);

                        this._fontData = parseFontData(str);
                    }

                    return result;
                }
            }

            return controls.Controls.resolveNothingLoaded();
        }

        getFontData(): IBitmapFontData {

            return this._fontData;
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

            const key = this.getKey();

            if (game.cache.bitmapFont.has(key)) {

                return;
            }

            const imageAsset = this.createImageAsset();

            imageAsset.addToPhaserCache(game, cache);

            const xmlFile = this.getFileFromAssetUrl(this.getData().fontDataURL);

            if (!xmlFile) {

                return;
            }

            const xmlString = colibri.ui.ide.FileUtils.getFileString(xmlFile);

            if (!xmlString) {

                return;
            }

            const frame = game.textures.getFrame(imageAsset.getKey());

            if (frame) {

                const xmlDoc = Phaser.DOM.ParseXML(xmlString);
                const xmlData = Phaser.GameObjects.BitmapText.ParseXMLBitmapFont(xmlDoc as any, frame);

                game.cache.bitmapFont.add(key, {
                    data: xmlData,
                    texture: key,
                    frame: null
                });

            } else {

                console.error(`Image '${imageAsset.getKey()}' key not found.`);
            }

            cache.addAsset(this);
        }
    }

    function getValue(node: Element, attribute: string) {

        return parseInt(node.getAttribute(attribute), 10);
    }

    function parseFontData(xmlContent: string) {

        const data: IBitmapFontData = {
            chars: new Map()
        };

        try {

            const xml = new DOMParser().parseFromString(xmlContent, "text/xml");

            const letters = xml.getElementsByTagName('char');

            // tslint:disable-next-line:prefer-for-of
            for (let i = 0; i < letters.length; i++) {

                const node = letters[i];

                const charCode = getValue(node, 'id');
                const gx = getValue(node, 'x');
                const gy = getValue(node, 'y');
                const gw = getValue(node, 'width');
                const gh = getValue(node, 'height');

                data.chars.set(charCode, {
                    x: gx,
                    y: gy,
                    width: gw,
                    height: gh,
                });
            }
        } catch (e) {

            console.error(e);
        }

        return data;
    }
}