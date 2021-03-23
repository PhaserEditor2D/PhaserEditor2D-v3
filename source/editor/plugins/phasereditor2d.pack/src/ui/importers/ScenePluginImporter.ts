namespace phasereditor2d.pack.ui.importers {

    import io = colibri.core.io;

    export class ScenePluginImporter extends SingleFileImporter {

        constructor() {
            super(webContentTypes.core.CONTENT_TYPE_JAVASCRIPT, core.SCENE_PLUGIN_TYPE);
        }

        createItemData(pack: core.AssetPack, file: io.FilePath) {

            const data = super.createItemData(pack, file);

            const key = file.getNameWithoutExtension();

            data.systemKey = key;
            data.sceneKey = key;

            return data;
        }

    }
}