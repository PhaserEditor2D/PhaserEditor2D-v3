namespace phasereditor2d.scene.ui.blocks {

    import controls = colibri.ui.controls;
    import io = colibri.core.io;

    export class SceneEditorBlocksTreeRendererProvider_Compact extends pack.ui.viewers.AssetPackTreeViewerRenderer {

        constructor(viewer: controls.viewers.TreeViewer) {
            super(viewer, false);

            this.setSections([]);
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