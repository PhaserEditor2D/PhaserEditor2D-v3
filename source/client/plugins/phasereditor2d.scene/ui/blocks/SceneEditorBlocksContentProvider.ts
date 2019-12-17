namespace phasereditor2d.scene.ui.blocks {

    import ide = colibri.ui.ide;

    const SCENE_EDITOR_BLOCKS_PACK_ITEM_TYPES = new Set(["image", "atlas", "atlasXML", "multiatlas", "unityAtlas", "spritesheet"]);

    export class SceneEditorBlocksContentProvider extends pack.ui.viewers.AssetPackContentProvider {

        private _getPacks : () => pack.core.AssetPack[];

        constructor(getPacks : () => pack.core.AssetPack[]) {
            super();
            
            this._getPacks = getPacks;
        }

        getPackItems() {

            return this._getPacks()

                .flatMap(pack => pack.getItems())

                .filter(item => SCENE_EDITOR_BLOCKS_PACK_ITEM_TYPES.has(item.getType()));
        }

        getRoots(input: any): any[] {

            const roots = [];

            roots.push(...this.getSceneFiles());

            roots.push(...this.getPackItems());

            return roots;
        }

        getSceneFiles() {
            return ide.FileUtils.getAllFiles().filter(file => file.getExtension() === "scene");
        }

        getChildren(parent: any): any[] {
            if (typeof (parent) === "string") {

                switch (parent) {
                    case pack.core.ATLAS_TYPE:
                        return this.getPackItems()
                            .filter(item => item instanceof pack.core.BaseAtlasAssetPackItem);

                    case PREFAB_SECTION:
                        //TODO: we need to implement the PrefabFinder
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