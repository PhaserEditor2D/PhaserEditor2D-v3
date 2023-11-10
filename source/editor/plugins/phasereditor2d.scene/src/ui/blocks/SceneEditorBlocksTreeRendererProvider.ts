namespace phasereditor2d.scene.ui.blocks {

    import controls = colibri.ui.controls;
    import io = colibri.core.io;

    export const BUILTIN_SECTION = "Built-In";

    export const PREFAB_SECTION = "Prefab";

    export const BLOCKS_ASSET_SECTIONS = [
        pack.core.IMAGE_TYPE,
        pack.core.SVG_TYPE,
        pack.core.ATLAS_TYPE,
        pack.core.SPRITESHEET_TYPE,
        pack.core.ANIMATION_TYPE,
        pack.core.BITMAP_FONT_TYPE,
        pack.core.SPINE_JSON_TYPE,
        pack.core.SPINE_BINARY_TYPE
    ]

    export const BLOCKS_SECTIONS = [
        BUILTIN_SECTION,
        PREFAB_SECTION,
        ...BLOCKS_ASSET_SECTIONS
    ];

    export class SceneEditorBlocksTreeRendererProvider extends pack.ui.viewers.AssetPackTreeViewerRenderer {
        private _blocksProvider: SceneEditorBlocksProvider;

        constructor(provider: SceneEditorBlocksProvider, viewer: controls.viewers.TreeViewer) {
            super(viewer, false);

            this._blocksProvider = provider;
        }

        isObjectSection(obj: any) {

            if (typeof obj === "string") {

                if (this._blocksProvider.getSelectedTabSection() === TAB_SECTION_BUILT_IN
                    && SCENE_OBJECT_CATEGORIES.indexOf(obj) >= 0) {

                    return true;
                }

                if (BLOCKS_SECTIONS.indexOf(obj) >= 0) {

                    return true;
                }
            }

            return obj instanceof pack.core.AssetPack
                || obj instanceof io.FilePath && obj.isFolder() || obj instanceof viewers.PhaserTypeSymbol;
        }

        isShadowAsChild(obj: any) {

            if (this._blocksProvider.getSelectedTabSection() === TAB_SECTION_BUILT_IN) {

                return false;
            }

            if (obj instanceof ui.sceneobjects.SceneObjectExtension || obj === ui.sceneobjects.ObjectList) {

                return true;
            }

            if (obj instanceof pack.core.SpineSkinItem) {

                return true;
            }

            if (obj instanceof pack.core.AnimationConfigInPackItem) {

                return true;
            }

            return super.isShadowAsChild(obj);
        }

        isSectionSorted(section: string) {

            if (section === BUILTIN_SECTION) {

                return false;
            }

            return true;
        }
    }
}