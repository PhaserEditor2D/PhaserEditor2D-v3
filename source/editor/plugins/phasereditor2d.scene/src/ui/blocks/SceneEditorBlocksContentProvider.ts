namespace phasereditor2d.scene.ui.blocks {

    const SCENE_EDITOR_BLOCKS_PACK_ITEM_TYPES = new Set(
        [
            pack.core.IMAGE_TYPE,
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

        getRoots(input: any): any[] {

            const roots = [];

            roots.push(...ScenePlugin.getInstance().getGameObjectExtensions());

            roots.push(...ScenePlugin.getInstance().getPlainObjectExtensions());

            roots.push(sceneobjects.ObjectList);

            roots.push(...this.getSceneFiles());

            roots.push(...this.getPackItems());

            return roots;
        }

        getSceneFiles() {

            const finder = ScenePlugin.getInstance().getSceneFinder();

            return finder.getSceneFiles()

                .filter(file => SceneMaker.acceptDropFile(file, this._editor.getInput()));
        }

        getChildren(parent: any): any[] {

            if (typeof (parent) === "string") {

                switch (parent) {
                    case pack.core.ATLAS_TYPE:

                        return this.getPackItems()
                            .filter(item => item instanceof pack.core.BaseAtlasAssetPackItem);

                    case pack.core.BITMAP_FONT_TYPE:

                        return this.getPackItems()
                            .filter(item => item instanceof pack.core.BitmapFontAssetPackItem);

                    case BUILTIN_SECTION:

                        const r = [
                            ...ScenePlugin.getInstance().getGameObjectExtensions(),
                            ...ScenePlugin.getInstance().getPlainObjectExtensions(),
                            sceneobjects.ObjectList];

                        console.log(r);

                        return r;

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