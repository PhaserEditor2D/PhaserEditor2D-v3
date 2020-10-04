namespace phasereditor2d.scene.ui.editor.outline {

    import controls = colibri.ui.controls;

    export class SceneEditorOutlineRendererProvider implements controls.viewers.ICellRendererProvider {

        getCellRenderer(element: any): controls.viewers.ICellRenderer {

            if (element instanceof Phaser.GameObjects.GameObject) {

                const obj = element as sceneobjects.ISceneGameObject;

                return obj.getEditorSupport().getCellRenderer();

            } else if (element instanceof Phaser.GameObjects.DisplayList
                || element instanceof sceneobjects.ObjectLists
                || typeof element === "string") {

                return new controls.viewers.IconImageCellRenderer(colibri.ColibriPlugin.getInstance().getIcon(colibri.ICON_FOLDER));
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