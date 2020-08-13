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

            viewer.setLabelProvider(
                new controls.viewers.LabelProvider(obj => {

                    const cmd = obj as ide.commands.Command;

                    const label = manager.getCategory(cmd.getCategoryId()).name
                        + ": " + cmd.getName();

                    const keys = manager.getCommandKeyString(cmd.getId());

                    if (keys) {

                        return label + " (" + keys + ")";
                    }

                    return label;
                }));

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
}