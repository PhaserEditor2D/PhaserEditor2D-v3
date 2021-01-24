/// <reference path="./ViewerDialog.ts" />

namespace colibri.ui.controls.dialogs {

    export class CommandDialog extends controls.dialogs.ViewerDialog {

        constructor() {
            super(new controls.viewers.TreeViewer("colibri.ui.controls.dialogs.CommandDialog"), false);

            const size = this.getSize();
            this.setSize(size.width * 1.5, size.height * 1.5);
        }

        create() {

            const manager = colibri.Platform.getWorkbench().getCommandManager();

            const viewer = this.getViewer();

            viewer.setStyledLabelProvider(new CommandStyledLabelProvider());

            viewer.setCellRendererProvider(
                new controls.viewers.EmptyCellRendererProvider(
                    args => new controls.viewers.IconImageCellRenderer(
                        colibri.Platform.getWorkbench().getWorkbenchIcon(colibri.ICON_KEYMAP))));

            viewer.setContentProvider(new controls.viewers.ArrayTreeContentProvider());

            viewer.setInput(manager.getActiveCommands());

            super.create();

            this.setTitle("Command Palette");

            this.enableButtonOnlyWhenOneElementIsSelected(

                this.addOpenButton("Execute", sel => {

                    manager.executeCommand((sel[0] as ide.commands.Command).getId(), true);
                })
            );

            this.addCancelButton();

            // this.addButton("Show All", () => {
            //     viewer.setInput(manager.getCommands());
            //     viewer.repaint();
            // });
        }
    }

    class CommandStyledLabelProvider implements controls.viewers.IStyledLabelProvider {

        getStyledTexts(obj: any, dark: boolean): viewers.IStyledText[] {

            const cmd = obj as ide.commands.Command;

            const manager = colibri.Platform.getWorkbench().getCommandManager();

            const label = manager.getCategory(cmd.getCategoryId()).name
                + ": " + cmd.getName();

            const keys = manager.getCommandKeyString(cmd.getId());

            const theme = controls.Controls.getTheme();

            if (keys) {

                return [
                    {
                        text: label,
                        color: theme.viewerForeground
                    },
                    {
                        text: " (" + keys + ")",
                        color: theme.viewerForeground + "90"
                    }
                ];
            }

            return [
                {
                    text: label,
                    color: theme.viewerForeground
                }
            ];
        }
    }
}