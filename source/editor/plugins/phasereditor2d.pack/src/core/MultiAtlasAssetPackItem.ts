namespace phasereditor2d.pack.core {

    import io = colibri.core.io;
    import ide = colibri.ui.ide;

    export class MultiatlasAssetPackItem extends BaseAtlasAssetPackItem {

        constructor(pack: AssetPack, data: any) {
            super(pack, data);
        }

        protected createParser(): parsers.ImageFrameParser {
            return new parsers.MultiAtlasParser(this);
        }

        computeUsedFiles(files: Set<io.FilePath>) {

            super.computeUsedFiles(files);

            try {

                const urlSet: Set<string> = new Set();

                const atlasUrl = this.getData().url as string;
                const atlasFile = this.getFileFromAssetUrl(atlasUrl);
                const atlasUrlElements = atlasUrl.split("/");
                atlasUrlElements.pop();
                const atlasUrlParent = atlasUrlElements.join("/");

                if (atlasFile) {

                    const str = ide.FileUtils.getFileString(atlasFile);

                    const data = JSON.parse(str);

                    for (const texture of data.textures) {

                        const url = io.FilePath.join(atlasUrlParent, texture.image);

                        urlSet.add(url);
                    }

                    for (const url of urlSet) {

                        const file = this.getFileFromAssetUrl(url);

                        files.add(file);
                    }
                }

            } catch (e) {

                console.error(e);
            }
        }
    }
}