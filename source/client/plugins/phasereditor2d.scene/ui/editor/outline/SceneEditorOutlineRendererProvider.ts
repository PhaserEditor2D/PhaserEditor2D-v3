namespace phasereditor2d.scene.ui.editor.outline {

    import controls = colibri.ui.controls;
    import ide = colibri.ui.ide;

    export class SceneEditorOutlineRendererProvider implements controls.viewers.ICellRendererProvider {

        getCellRenderer(element: any): controls.viewers.ICellRenderer {

            if (element instanceof Phaser.GameObjects.GameObject) {

                const obj = element as sceneobjects.ISceneObject;

                return obj.getEditorSupport().getCellRenderer();

            } else if (element instanceof Phaser.GameObjects.DisplayList
                || element instanceof sceneobjects.ObjectLists) {

                return new controls.viewers.IconImageCellRenderer(colibri.ColibriPlugin.getInstance().getIcon(colibri.ICON_FOLDER));

            } else if (element instanceof sceneobjects.ObjectList) {

                return new controls.viewers.IconImageCellRenderer(ScenePlugin.getInstance().getIcon(ICON_LIST));
            }

            return new controls.viewers.EmptyCellRenderer(false);
        }

        async preload(args: controls.viewers.PreloadCellArgs): Promise<controls.PreloadResult> {
            return controls.Controls.resolveNothingLoaded();
        }
    }
}