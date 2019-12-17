namespace phasereditor2d.scene.ui.blocks {

    import controls = colibri.ui.controls;

    export const PREFAB_SECTION = "Prefab";

    export class SceneEditorBlocksTreeRendererProvider extends pack.ui.viewers.AssetPackTreeViewerRenderer {

        constructor(viewer: controls.viewers.TreeViewer) {
            super(viewer, false);

            this.setSections([

                PREFAB_SECTION,
                pack.core.IMAGE_TYPE,
                pack.core.ATLAS_TYPE,
                pack.core.SPRITESHEET_TYPE

            ]);
        }
    }
}