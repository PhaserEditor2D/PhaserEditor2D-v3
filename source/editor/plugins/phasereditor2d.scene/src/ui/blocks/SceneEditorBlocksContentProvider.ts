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
        private _blocksProvider: SceneEditorBlocksProvider;
        private _editor: editor.SceneEditor;

        constructor(editor: editor.SceneEditor, getPacks: () => pack.core.AssetPack[]) {
            super();

            this._blocksProvider = editor.getBlocksProvider();
            this._getPacks = getPacks;
            this._editor = this._blocksProvider.getEditor();
        }

        getPackItems() {

            return this._getPacks()

                .flatMap(pack => pack.getItems())

                .filter(item => SCENE_EDITOR_BLOCKS_PACK_ITEM_TYPES.has(item.getType()));
        }

        getRoots(input: any) {

            const groupingType = grouping.getGroupingPreference();
            const section = this._blocksProvider.getSelectedTabSection();

            switch (section) {

                case TAB_SECTION_BUILT_IN:

                    return SCENE_OBJECT_CATEGORIES;

                case TAB_SECTION_PREFABS:

                    if (groupingType === grouping.GROUP_ASSETS_BY_LOCATION) {

                        return colibri.ui.ide.FileUtils.distinct(this.getSceneFiles("prefabs").map(f => f.getParent()));
                    }

                    return viewers.PhaserTypeSymbol.getSymbols();
            }


            switch (groupingType) {

                case grouping.GROUP_ASSETS_BY_TYPE:

                    if (section === TAB_SECTION_ASSETS) {

                        return BLOCKS_ASSET_SECTIONS;
                    }

                    return BLOCKS_SECTIONS;

                case grouping.GROUP_ASSETS_BY_PACK:

                    if (section === TAB_SECTION_ASSETS) {

                        return this._getPacks();
                    }

                    return [
                        BUILTIN_SECTION,
                        PREFAB_SECTION,
                        ...this._getPacks()
                    ];

                case grouping.GROUP_ASSETS_BY_LOCATION:

                    const packFolders = grouping.getAssetsFolders(this._getPacks());

                    if (section === TAB_SECTION_ASSETS) {

                        return packFolders;
                    }

                    return [
                        BUILTIN_SECTION,
                        ...colibri.ui.ide.FileUtils.distinct([
                            ...this.getSceneFiles().map(f => f.getParent()),
                            ...packFolders])
                    ]
            }

            return [];
        }

        private getSceneFiles(sceneType: "prefabs" | "all" = "all") {

            const finder = ScenePlugin.getInstance().getSceneFinder();

            const files = (sceneType === "prefabs" ? finder.getPrefabFiles() : finder.getSceneFiles());

            return files.filter(file => SceneMaker.acceptDropFile(file, this._editor.getInput()));
        }

        getChildren(parent: any): any[] {

            if (parent instanceof viewers.PhaserTypeSymbol) {

                const finder = ScenePlugin.getInstance().getSceneFinder();

                return this.getSceneFiles().filter(file => finder.getScenePhaserType(file) === parent.getPhaserType());
            }

            if (parent instanceof pack.core.AssetPack) {

                return parent.getItems().filter(i => SCENE_EDITOR_BLOCKS_PACK_ITEM_TYPES.has(i.getType()));
            }

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

                const tabSection = this._editor.getBlocksProvider().getSelectedTabSection();

                if (tabSection === TAB_SECTION_PREFABS) {

                    return this.getSceneFiles("prefabs").filter(f => f.getParent() === parent);
                }

                const scenes = this.getSceneFiles().filter(f => f.getParent() === parent);
                const items = this.getPackItems().filter(item => grouping.getItemFolder(item) === parent);

                return [...scenes, ...items];
            }

            return super.getChildren(parent);
        }
    }
}