/// <reference path="./ViewerDialog.ts" />

namespace colibri.ui.controls.dialogs {

    export class CommandDialog extends controls.dialogs.ViewerDialog {

        constructor() {
            super(new controls.viewers.TreeViewer());
        }

        create() {

            const manager = colibri.Platform.getWorkbench().getCommandManager();

            const viewer = this.getViewer();

            viewer.setLabelProvider(
                new controls.viewers.LabelProvider(obj => {

                    const cmd = obj as ide.commands.Command;

                    const keys = manager.getCommandKeyString(cmd.getId());

                    if (keys) {

                        return cmd.getName() + " (" + keys + ")";
                    }

                    return cmd.getName();
                }));

            viewer.setCellRendererProvider(
                new controls.viewers.EmptyCellRendererProvider(
                    args => new controls.viewers.IconImageCellRenderer(
                        colibri.Platform.getWorkbench().getWorkbenchIcon(colibri.ui.ide.ICON_KEYMAP))));

            viewer.setContentProvider(new controls.viewers.ArrayTreeContentProvider());

            viewer.setInput(manager.getActiveCommands());

            super.create();

            this.setTitle("Command Palette");

            this.enableButtonOnlyWhenOneElementIsSelected(
                this.addOpenButton("Execute", sel => {
                    manager.executeCommand((sel[0] as ide.commands.Command).getId());
                })
            );
        }
    }
}