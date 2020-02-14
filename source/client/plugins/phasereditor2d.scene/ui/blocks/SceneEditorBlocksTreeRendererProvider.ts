namespace phasereditor2d.scene.ui.blocks {

    import controls = colibri.ui.controls;
    import io = colibri.core.io;

    export const PREFAB_SECTION = "Prefab";

    export class SceneEditorBlocksTreeRendererProvider extends pack.ui.viewers.AssetPackTreeViewerRenderer {

        constructor(viewer: controls.viewers.TreeViewer) {
            super(viewer, false);

            this.setSections([

                PREFAB_SECTION,
                pack.core.IMAGE_TYPE,
                pack.core.ATLAS_TYPE,
                pack.core.SPRITESHEET_TYPE,
                pack.core.BITMAP_FONT_TYPE
            ]);
        }

        prepareContextForText(args: controls.viewers.RenderCellArgs) {

            super.prepareContextForText(args);

            if (args.obj instanceof io.FilePath) {

                const type = colibri.Platform.getWorkbench().getContentTypeRegistry().getCachedContentType(args.obj);

                if (type === core.CONTENT_TYPE_SCENE) {

                    args.canvasContext.font = `italic ${controls.FONT_HEIGHT}px ${controls.FONT_FAMILY}`;
                }
            }
        }
    }
}