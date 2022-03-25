/// <reference path="../viewers/TreeViewer.ts"/>
/// <reference path="../viewers/LabelProvider.ts"/>
namespace colibri.ui.controls.dialogs {

    import controls = colibri.ui.controls;

    export class ThemesDialog extends controls.dialogs.ViewerDialog {

        constructor() {
            super(new ThemeViewer(), false);

            this.setSize(400, 400, true);
        }

        create() {

            super.create();

            this.setTitle("Themes");

            this.addButton("Close", () => this.close());
        }
    }

    class ThemeViewer extends viewers.TreeViewer {

        constructor() {
            super("ThemeViewer");

            this.setLabelProvider(new ThemeLabelProvider());
            this.setContentProvider(new controls.viewers.ArrayTreeContentProvider());

            this.setCellRendererProvider(
                new controls.viewers.EmptyCellRendererProvider(
                    e => new controls.viewers.IconImageCellRenderer(
                        colibri.ColibriPlugin.getInstance().getIcon(colibri.ICON_COLOR)
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

        getLabel(theme: controls.ITheme) {
            return theme.displayName;
        }
    }
}