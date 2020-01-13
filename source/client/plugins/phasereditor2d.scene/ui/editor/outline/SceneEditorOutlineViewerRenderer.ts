namespace phasereditor2d.scene.ui.editor.outline {

    import controls = colibri.ui.controls;

    export class SceneEditorOutlineViewerRenderer extends controls.viewers.TreeViewerRenderer {

        constructor(viewer: controls.viewers.TreeViewer) {
            super(viewer, 48);
        }

        prepareContextForText(args: controls.viewers.RenderCellArgs) {

            if (args.obj instanceof Phaser.GameObjects.GameObject) {

                const obj = args.obj as sceneobjects.SceneObject;

                if (obj.getEditorSupport().isPrefabInstance()) {

                    args.canvasContext.font = `italic ${controls.FONT_HEIGHT}px ${controls.FONT_FAMILY}`;
                }
            }

            super.prepareContextForText(args);
        }
    }
}