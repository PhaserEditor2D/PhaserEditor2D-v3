namespace phasereditor2d.scene.ui.editor.outline {

    import controls = colibri.ui.controls;

    export class SceneEditorOutlineViewerRenderer extends controls.viewers.TreeViewerRenderer {

        constructor(viewer: controls.viewers.TreeViewer) {
            super(viewer, 48);
        }

        protected prepareContextForRenderCell(args: controls.viewers.RenderCellArgs) {

            if (this.isNonTopPrefabObject(args.obj)) {

                args.canvasContext.globalAlpha = 0.3;
            }
        }

        private isNonTopPrefabObject(obj: any) {

            const support = sceneobjects.GameObjectEditorSupport.getEditorSupport(obj);

            if (support) {

                return support.getScene().isNonTopPrefabObject(obj);
            }

            return false;
        }


        prepareContextForText(args: controls.viewers.RenderCellArgs) {

            if (sceneobjects.isGameObject(args.obj)) {

                const obj = args.obj as sceneobjects.ISceneGameObject;

                if (obj.getEditorSupport().isPrefabInstance()) {

                    args.canvasContext.font = `italic ${controls.getCanvasFontHeight()}px ${controls.FONT_FAMILY}`;
                }
            }

            if (this.isNonTopPrefabObject(args.obj)) {

                args.canvasContext.globalAlpha = 0.3;
            }

            super.prepareContextForText(args);
        }
    }
}