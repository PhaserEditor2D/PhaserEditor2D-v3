namespace phasereditor2d.files.ui.actions {

    import controls = colibri.ui.controls;
    import io = colibri.core.io;

    export class OpenNewFileDialogAction extends controls.Action {

        private _initialLocation: io.FilePath;

        constructor() {
            super({
                commandId: CMD_NEW_FILE,
                showText: false,
                icon: FilesPlugin.getInstance().getIcon(ICON_NEW_FILE)
            });
        }

        static commandTest(args: colibri.ui.ide.commands.CommandArgs): boolean {

            const root = colibri.ui.ide.FileUtils.getRoot();

            return root !== null && !args.activeDialog;
        }

        run() {

            const viewer = new controls.viewers.TreeViewer();

            viewer.setLabelProvider(new WizardLabelProvider());
            viewer.setContentProvider(new controls.viewers.ArrayTreeContentProvider());
            viewer.setCellRendererProvider(new WizardCellRendererProvider());

            const extensions = colibri.Platform.getExtensionRegistry()
                .getExtensions(files.ui.dialogs.NewDialogExtension.POINT_ID);

            viewer.setInput(extensions);

            const dlg = new controls.dialogs.ViewerDialog(viewer);

            dlg.create();

            dlg.setTitle("New");

            {
                const selectCallback = () => {

                    dlg.close();

                    this.openFileDialog(viewer.getSelectionFirstElement());
                };

                const btn = dlg.addButton("Select", () => selectCallback());

                btn.disabled = true;

                viewer.addEventListener(controls.EVENT_SELECTION_CHANGED, e => {
                    btn.disabled = viewer.getSelection().length !== 1;
                });

                viewer.addEventListener(controls.viewers.EVENT_OPEN_ITEM, e => selectCallback());
            }

            dlg.addButton("Cancel", () => dlg.close());
        }

        private openFileDialog(extension: ui.dialogs.NewDialogExtension) {

            const dlg = extension.createDialog();

            dlg.setTitle(`New ${extension.getDialogName()}`);

            // TODO: this is ugly, we should add this to the NewDialogExtension API.
            if (dlg instanceof dialogs.NewFileDialog) {

                const ext = extension as dialogs.NewFileExtension;
                dlg.setInitialFileName(ext.getInitialFileName());
                dlg.setInitialLocation(this._initialLocation ?? ext.getInitialFileLocation());

                dlg.validate();
            }
        }

        setInitialLocation(folder: io.FilePath) {
            this._initialLocation = folder;
        }
    }

    class WizardLabelProvider implements controls.viewers.ILabelProvider {

        getLabel(obj: any): string {
            return (obj as dialogs.NewFileExtension).getDialogName();
        }
    }

    class WizardCellRendererProvider implements controls.viewers.ICellRendererProvider {

        getCellRenderer(element: any): controls.viewers.ICellRenderer {

            const ext = element as dialogs.NewFileExtension;

            return new controls.viewers.IconImageCellRenderer(ext.getIcon());
        }

        preload(args: controls.viewers.PreloadCellArgs): Promise<controls.PreloadResult> {
            return controls.Controls.resolveNothingLoaded();
        }
    }
}