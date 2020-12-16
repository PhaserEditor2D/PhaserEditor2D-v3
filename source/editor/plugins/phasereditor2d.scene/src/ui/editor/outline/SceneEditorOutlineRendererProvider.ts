namespace phasereditor2d.scene.ui.editor.outline {

    import controls = colibri.ui.controls;

    export class SceneEditorOutlineRendererProvider implements controls.viewers.ICellRendererProvider {

        getCellRenderer(element: any): controls.viewers.ICellRenderer {

            const support = sceneobjects.EditorSupport.getEditorSupport(element);

            if (support) {

                return support.getCellRenderer();

            } else if (element instanceof Phaser.GameObjects.DisplayList
                || element instanceof sceneobjects.ObjectLists
                || typeof element === "string") {

                return new controls.viewers.IconImageCellRenderer(colibri.ColibriPlugin.getInstance().getIcon(colibri.ICON_FOLDER));

            } else if (element instanceof sceneobjects.ObjectList) {

                return new controls.viewers.IconImageCellRenderer(ScenePlugin.getInstance().getIcon(ICON_LIST));
            }

            const extensions = ScenePlugin.getInstance().getSceneEditorOutlineExtensions();

            for (const ext of extensions) {

                if (ext.isCellRendererProviderFor(element)) {

                    return ext.getCellRendererProvider().getCellRenderer(element);
                }
            }

            return new controls.viewers.EmptyCellRenderer(false);
        }

        async preload(args: controls.viewers.PreloadCellArgs): Promise<controls.PreloadResult> {

            return controls.Controls.resolveNothingLoaded();
        }
    }
}