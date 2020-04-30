namespace phasereditor2d.files.ui.actions {

    import controls = colibri.ui.controls;
    import io = colibri.core.io;

    export class RenameFileAction extends colibri.ui.ide.actions.ViewerViewAction<views.FilesView> {

        static isEnabled(view: views.FilesView): boolean {
            return view.getViewer().getSelection().length === 1;
        }

        constructor(view: views.FilesView) {
            super(view, {
                commandId: colibri.ui.ide.actions.CMD_RENAME,
                enabled: RenameFileAction.isEnabled(view)
            });
        }

        run() {

            const file: io.FilePath = this.getViewViewer().getSelectionFirstElement();

            const parent = file.getParent();

            const dlg = new controls.dialogs.InputDialog();

            dlg.create();

            dlg.setTitle("Rename");

            dlg.setMessage("Enter the new name");

            dlg.setInitialValue(file.getName());

            dlg.setInputValidator(value => {

                if (value.indexOf("/") >= 0) {
                    return false;
                }

                if (parent) {

                    const file2 = parent.getFile(value) ?? null;

                    return file2 === null;
                }

                return false;
            });

            dlg.setResultCallback(result => {

                colibri.ui.ide.FileUtils.renameFile_async(file, result);

                blocks.BlocksPlugin.getInstance().refreshBlocksView();
            });

            dlg.validate();
        }
    }
}