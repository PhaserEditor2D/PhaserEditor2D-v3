namespace phasereditor2d.ide.ui.dialogs {

    import controls = colibri.ui.controls;

    export class ThemesDialog extends controls.dialogs.ViewerDialog {

        constructor() {
            super(new ThemeViewer());

            this.setSize(200, 300);
        }

        create() {

            super.create();

            this.setTitle("Themes");

            this.addButton("Close", () => this.close());
        }
    }


    class ThemeViewer extends controls.viewers.TreeViewer {

        constructor() {
            super("ThemeViewer");

            this.setLabelProvider(new ThemeLabelProvider());
            this.setContentProvider(new controls.viewers.ArrayTreeContentProvider());

            this.setCellRendererProvider(
                new controls.viewers.EmptyCellRendererProvider(
                    e => new controls.viewers.IconImageCellRenderer(
                        IDEPlugin.getInstance().getIcon(ICON_THEME)
                    )
                )
            );

            this.setInput(
                colibri.Platform
                    .getExtensions<colibri.ui.ide.themes.ThemeExtension>(colibri.ui.ide.themes.ThemeExtension.POINT_ID)
                    .map(ext => ext.getTheme())
                    .sort((a, b) => a.displayName.localeCompare(b.displayName))
            );
        }
    }

    class ThemeLabelProvider extends controls.viewers.LabelProvider {

        getLabel(theme: controls.Theme) {
            return theme.displayName;
        }
    }
}