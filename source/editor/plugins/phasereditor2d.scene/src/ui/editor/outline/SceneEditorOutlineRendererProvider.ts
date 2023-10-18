namespace phasereditor2d.scene.ui.editor.outline {

    import controls = colibri.ui.controls;

    export class SceneEditorOutlineRendererProvider implements controls.viewers.ICellRendererProvider {

        getCellRenderer(element: any): controls.viewers.ICellRenderer {

            const support = sceneobjects.EditorSupport.getEditorSupport(element);

            if (support) {

                return support.getCellRenderer();

            } else if (element instanceof Phaser.GameObjects.DisplayList
                || element instanceof sceneobjects.ObjectLists
                || typeof element === "string"
                || element instanceof sceneobjects.PrefabUserProperties) {

                return new controls.viewers.IconImageCellRenderer(colibri.ColibriPlugin.getInstance().getIcon(colibri.ICON_FOLDER));

            } else if (element instanceof sceneobjects.ObjectList) {

                return new controls.viewers.IconImageCellRenderer(resources.getIcon(resources.ICON_LIST));

            } else if (element instanceof sceneobjects.ObjectListItem) {

                return new sceneobjects.ObjectListItemCellRenderer(
                    this.getCellRenderer(element.getObject()));

            } else if (element instanceof sceneobjects.UserComponentNode) {

                return new controls.viewers.IconImageCellRenderer(resources.getIcon(resources.ICON_USER_COMPONENT));

            } else if (element instanceof sceneobjects.UserProperty) {

                return new controls.viewers.IconImageCellRenderer(resources.getIcon(resources.ICON_USER_PROPERTY));

            } else if (element instanceof codesnippets.CodeSnippets) {

                return new controls.viewers.IconImageCellRenderer(colibri.ColibriPlugin.getInstance().getIcon(colibri.ICON_FOLDER));

            } else if (element instanceof codesnippets.CodeSnippet) {

                return new controls.viewers.IconImageCellRenderer(resources.getIcon(resources.ICON_BUILD));
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