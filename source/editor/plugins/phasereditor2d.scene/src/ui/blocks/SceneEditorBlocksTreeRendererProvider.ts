namespace phasereditor2d.scene.ui.blocks {

    import controls = colibri.ui.controls;

    export const BUILTIN_SECTION = "Built-In";

    export const PREFAB_SECTION = "Prefab";

    export const BLOCKS_SECTIONS = [

        BUILTIN_SECTION,
        PREFAB_SECTION,
        pack.core.IMAGE_TYPE,
        pack.core.ATLAS_TYPE,
        pack.core.SPRITESHEET_TYPE,
        pack.core.BITMAP_FONT_TYPE
    ];

    export class SceneEditorBlocksTreeRendererProvider extends pack.ui.viewers.AssetPackTreeViewerRenderer {

        constructor(viewer: controls.viewers.TreeViewer) {
            super(viewer, false);

            this.setSections(BLOCKS_SECTIONS);
        }

        isShadowAsChild(obj: any) {

            if (obj instanceof ui.sceneobjects.SceneObjectExtension || obj === ui.sceneobjects.ObjectList) {

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