namespace phasereditor2d.scene.ui.blocks {

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

            return BLOCKS_SECTIONS;
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
                    case pack.core.IMAGE_TYPE:
                    case pack.core.SVG_TYPE:

                        return this.getPackItems()
                            .filter(item => item instanceof pack.core.ImageAssetPackItem);

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

            return super.getChildren(parent);
        }
    }
}