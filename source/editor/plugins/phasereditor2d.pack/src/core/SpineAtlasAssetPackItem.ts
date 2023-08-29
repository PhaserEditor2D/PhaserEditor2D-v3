namespace phasereditor2d.pack.core {

    import controls = colibri.ui.controls;
    import ide = colibri.ui.ide;

    export class SpineAtlasAssetPackItem extends BaseAtlasAssetPackItem {

        constructor(pack: AssetPack, data: any) {
            super(pack, data);
        }

        protected createParser(): parsers.ImageFrameParser {

            return new parsers.SpineAtlasParser(this);
        }

        getAtlasString() {

            const atlasUrl = this.getData().url as string;
            const atlasFile = this.getFileFromAssetUrl(atlasUrl);

            if (atlasFile) {

                return ide.FileUtils.getFileString(atlasFile);
            }

            return undefined;
        }

        getSpineTextureAtlas() {

            const str = this.getAtlasString();

            if (str) {

                const atlas = new spine.TextureAtlas(str);

                for(const page of atlas.pages) {

                    page.setTexture(new FakeTexture());
                }

                return atlas;
            }

            return undefined;
        }

        computeUsedFiles(files: Set<colibri.core.io.FilePath>): void {

            super.computeUsedFiles(files);

            try {

                const atlasUrl = this.getData().url as string;
                const atlasFile = this.getFileFromAssetUrl(atlasUrl);

                if (atlasFile) {

                    const textureFiles = parsers.SpineAtlasParser.getTextureFiles(atlasFile);

                    for (const file of textureFiles) {

                        files.add(file);
                    }
                }

            } catch (e) {

                console.error(e);
            }
        }
    }

    class FakeTexture extends spine.Texture {
        
        private static _auxImage = document.createElement("image") as HTMLImageElement;

        constructor() {
            super(FakeTexture._auxImage);
        }

        setFilters(minFilter: spine.TextureFilter, magFilter: spine.TextureFilter): void {

        }

        setWraps(uWrap: spine.TextureWrap, vWrap: spine.TextureWrap): void {

        }

        dispose(): void {

        }
    }
}