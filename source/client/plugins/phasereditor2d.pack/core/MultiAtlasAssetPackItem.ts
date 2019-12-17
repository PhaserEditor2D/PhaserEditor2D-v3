namespace phasereditor2d.pack.core {

    import io = colibri.core.io;
    import ide = colibri.ui.ide;
    import controls = colibri.ui.controls;

    export class MultiatlasAssetPackItem extends BaseAtlasAssetPackItem {

        constructor(pack: AssetPack, data: any) {
            super(pack, data)
        }

        protected createParser(): parsers.ImageFrameParser {
            return new parsers.MultiAtlasParser(this);
        }

        computeUsedFiles(files: Set<io.FilePath>) {

            super.computeUsedFiles(files);

            try {

                const urlSet: Set<string> = new Set();

                const atlasFile = core.AssetPackUtils.getFileFromPackUrl(this.getData().url);

                if (atlasFile) {

                    const str = ide.FileUtils.getFileString(atlasFile);

                    const data = JSON.parse(str);

                    for (const texture of data.textures) {
                        const url = core.AssetPackUtils.getFilePackUrl(atlasFile.getSibling(texture.image));
                        urlSet.add(url)
                    }

                    for (const url of urlSet) {
                        const file = core.AssetPackUtils.getFileFromPackUrl(url);
                        files.add(file);
                    }
                }
                
            } catch (e) {
                console.error(e);
            }
        }
    }
}