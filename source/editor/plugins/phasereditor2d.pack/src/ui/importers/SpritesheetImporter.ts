namespace phasereditor2d.pack.ui.importers {

    import io = colibri.core.io;

    export class SpritesheetImporter extends SingleFileImporter {

        constructor() {
            super(webContentTypes.core.CONTENT_TYPE_IMAGE, core.SPRITESHEET_TYPE);
        }

        createItemData(pack: core.AssetPack, file: io.FilePath) {

            const data = super.createItemData(pack, file);

            data.frameConfig = {
                frameWidth: 32,
                frameHeight: 32,
                startFrame: 0,
                endFrame: -1,
                spacing: 0,
                margin: 0
            };

            return data;
        }

    }
}