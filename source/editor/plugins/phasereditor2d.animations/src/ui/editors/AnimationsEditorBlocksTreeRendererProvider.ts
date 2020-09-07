namespace phasereditor2d.animations.ui.editors {

    import controls = colibri.ui.controls;

    export class AnimationsEditorBlocksTreeRendererProvider extends pack.ui.viewers.AssetPackTreeViewerRenderer {

        constructor(viewer: controls.viewers.TreeViewer) {
            super(viewer, false);

            this.setSections([

                pack.core.ATLAS_TYPE,
                pack.core.SPRITESHEET_TYPE,
                pack.core.IMAGE_TYPE,
            ]);
        }
    }
}