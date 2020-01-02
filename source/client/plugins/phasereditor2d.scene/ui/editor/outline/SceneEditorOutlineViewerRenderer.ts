namespace phasereditor2d.scene.ui.editor.outline {

    import controls = colibri.ui.controls;

    const COLORS = {
        light: {
            selected: "#ffaaaa",
            normal: "#ff2222"
        },
        dark: {
            selected: "#550055",
            normal: "#ffaaff"
        }
    };

    export class SceneEditorOutlineViewerRenderer extends controls.viewers.TreeViewerRenderer {

        constructor(viewer: controls.viewers.TreeViewer) {
            super(viewer, 48);
        }

        setTextColor(args: controls.viewers.RenderCellArgs) {

            if (args.obj instanceof Phaser.GameObjects.GameObject) {

                const obj = args.obj as sceneobjects.SceneObject;

                if (obj.getEditorSupport().isPrefabInstance()) {

                    const colors = controls.Controls.getTheme().dark ? COLORS.dark : COLORS.light;

                    const color = args.viewer.isSelected(args.obj) ? colors.selected : colors.normal;

                    args.canvasContext.fillStyle = color;

                    return;
                }
            }

            super.setTextColor(args);
        }
    }
}