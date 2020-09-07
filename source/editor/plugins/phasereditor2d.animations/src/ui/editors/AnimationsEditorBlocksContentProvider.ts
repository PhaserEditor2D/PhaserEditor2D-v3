namespace phasereditor2d.animations.ui.editors {

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

    export class AnimationsEditorBlocksContentProvider extends pack.ui.viewers.AssetPackContentProvider {

        private _getPacks: () => pack.core.AssetPack[];
        private _editor: AnimationsEditor;

        constructor(sceneEditor: AnimationsEditor, getPacks: () => pack.core.AssetPack[]) {
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

            return this.getPackItems();
        }

        getChildren(parent: any): any[] {

            if (typeof (parent) === "string") {

                switch (parent) {
                    case pack.core.ATLAS_TYPE:
                        return this.getPackItems()
                            .filter(item => item instanceof pack.core.BaseAtlasAssetPackItem);

                    case pack.core.SPRITESHEET_TYPE:
                        return this.getPackItems()
                            .filter(item => item instanceof pack.core.SpritesheetAssetPackItem);
                }

                return this.getPackItems()
                    .filter(item => item.getType() === parent);
            }

            return super.getChildren(parent);
        }
    }
}