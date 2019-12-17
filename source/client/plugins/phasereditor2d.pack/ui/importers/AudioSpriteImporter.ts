namespace phasereditor2d.pack.ui.importers {

    import ide = colibri.ui.ide;

    export class AudioSpriteImporter extends ContentTypeImporter {
        constructor() {
            super(core.contentTypes.CONTENT_TYPE_AUDIO_SPRITE, core.AUDIO_SPRITE_TYPE);
        }

        createItemData(file: colibri.core.io.FilePath) {

            const reg = ide.Workbench.getWorkbench().getContentTypeRegistry();

            const baseName = file.getNameWithoutExtension();

            const urls = file.getParent().getFiles()

                .filter(f => reg.getCachedContentType(f) === webContentTypes.core.CONTENT_TYPE_AUDIO)

                .filter(f => f.getNameWithoutExtension() === baseName)

                .map(f => core.AssetPackUtils.getFilePackUrl(f));

            return {
                jsonURL: core.AssetPackUtils.getFilePackUrl(file),
                audioURL: urls
            }
        }
    }
}