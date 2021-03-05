namespace phasereditor2d.animations.ui.editors {

    const grouping = pack.ui.viewers.AssetPackGrouping;

    import io = colibri.core.io;

    const PACK_ITEM_TYPES = new Set(
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

                .flatMap(pack => this.filterItems(pack))
        }

        private filterItems(pack: pack.core.AssetPack) {

            return pack.getItems().filter(i => PACK_ITEM_TYPES.has(i.getType()));
        }

        getRoots_(input: any): any[] {

            return [
                pack.core.ATLAS_TYPE,
                pack.core.SPRITESHEET_TYPE,
                pack.core.IMAGE_TYPE,
            ];
        }

        getRoots(input: any) {

            const type = grouping.getGroupingPreference();

            switch (type) {

                case grouping.GROUP_ASSETS_BY_TYPE:

                    return [
                        pack.core.ATLAS_TYPE,
                        pack.core.SPRITESHEET_TYPE,
                        pack.core.IMAGE_TYPE,
                        pack.core.SVG_TYPE
                    ];

                case grouping.GROUP_ASSETS_BY_PACK:

                    return pack.core.AssetPackUtils.distinct(this.getPackItems().map(i => i.getPack()));

                case grouping.GROUP_ASSETS_BY_LOCATION:

                    return colibri.ui.ide.FileUtils.distinct([
                        ...grouping.getAssetsFolders(this.getPackItems().map(i => i.getPack()))])
            }

            return [];
        }

        getChildren(parent: any): any[] {

            if (parent === pack.core.ATLAS_TYPE) {

                return this.getPackItems()
                    .filter(item => pack.core.AssetPackUtils.isAtlasType(item.getType()));
            }

            if (PACK_ITEM_TYPES.has(parent)) {

                return this.getPackItems()
                    .filter(item => item.getType() === parent);
            }

            if (parent instanceof io.FilePath) {

                return this.getPackItems().filter(i => grouping.getItemFolder(i) === parent);
            }

            return super.getChildren(parent)
                .filter(obj => !(obj instanceof pack.core.AssetPackItem) || PACK_ITEM_TYPES.has(obj.getType()));
        }
    }
}