namespace phasereditor2d.scene.ui.blocks {

    import io = colibri.core.io;

    const SCENE_EDITOR_BLOCKS_PACK_ITEM_TYPES = new Set(
        [
            pack.core.IMAGE_TYPE,
            pack.core.SVG_TYPE,
            pack.core.ATLAS_TYPE,
            pack.core.ATLAS_XML_TYPE,
            pack.core.MULTI_ATLAS_TYPE,
            pack.core.UNITY_ATLAS_TYPE,
            pack.core.SPRITESHEET_TYPE,
            pack.core.BITMAP_FONT_TYPE
        ]);

    const grouping = pack.ui.viewers.AssetPackGrouping;

    export class SceneEditorBlocksContentProvider extends pack.ui.viewers.AssetPackContentProvider {

        private _getPacks: () => pack.core.AssetPack[];
        private _editor: editor.SceneEditor;

        constructor(sceneEditor: editor.SceneEditor, getPacks: () => pack.core.AssetPack[]) {
            super();

            this._getPacks = getPacks;
            this._editor = sceneEditor;
        }

        getPackItems() {

            return this._getPacks()

                .flatMap(pack => pack.getItems())

                .filter(item => SCENE_EDITOR_BLOCKS_PACK_ITEM_TYPES.has(item.getType()));
        }

        getRoots(input: any) {

            const type = grouping.getGroupingPreference();

            switch (type) {

                case grouping.GROUP_ASSETS_BY_TYPE:

                    return BLOCKS_SECTIONS;

                case grouping.GROUP_ASSETS_BY_PACK:
                    return [
                        BUILTIN_SECTION,
                        PREFAB_SECTION,
                        ...this._getPacks()
                    ];
                case grouping.GROUP_ASSETS_BY_LOCATION:

                    return [
                        BUILTIN_SECTION,
                        ...colibri.ui.ide.FileUtils.distinct([
                            ...this.getSceneFiles().map(f => f.getParent()),
                            ...grouping.getAssetsFolders(this._getPacks())])
                    ]
            }

            return [];
        }

        getSceneFiles() {

            const finder = ScenePlugin.getInstance().getSceneFinder();

            return finder.getSceneFiles()

                .filter(file => SceneMaker.acceptDropFile(file, this._editor.getInput()));
        }

        getChildren(parent: any): any[] {

            if (typeof (parent) === "string") {

                if (SCENE_OBJECT_CATEGORY_SET.has(parent)) {

                    const isPrefabScene = this._editor.getScene() && this._editor.getScene().isPrefabSceneType();

                    const exts = [
                        ...ScenePlugin.getInstance().getGameObjectExtensions(),
                        ...ScenePlugin.getInstance().getPlainObjectExtensions()
                    ]
                        .filter(ext => !isPrefabScene || ext.isAvailableAsPrefabElement())

                        .filter(ext => ext.getCategory() === parent);

                    return [
                        ...exts,
                        ... (parent === SCENE_OBJECT_GROUPING_CATEGORY ? [sceneobjects.ObjectList] : [])
                    ];
                }

                switch (parent) {

                    case pack.core.ATLAS_TYPE:

                        return this.getPackItems()
                            .filter(item => item instanceof pack.core.BaseAtlasAssetPackItem);

                    case pack.core.BITMAP_FONT_TYPE:

                        return this.getPackItems()
                            .filter(item => item instanceof pack.core.BitmapFontAssetPackItem);

                    case BUILTIN_SECTION:

                        return SCENE_OBJECT_CATEGORIES;

                    case PREFAB_SECTION:

                        const files = this.getSceneFiles();

                        return files;
                }

                return this.getPackItems()
                    .filter(item => item.getType() === parent);
            }

            if (parent instanceof io.FilePath && parent.isFolder()) {

                const scenes = this.getSceneFiles().filter(f => f.getParent() === parent);
                const items = this.getPackItems().filter(item => grouping.getItemFolder(item) === parent);

                return [...scenes, ...items];
            }

            return super.getChildren(parent);
        }
    }
}