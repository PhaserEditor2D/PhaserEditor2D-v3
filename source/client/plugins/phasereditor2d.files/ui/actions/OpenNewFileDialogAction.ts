namespace phasereditor2d.files.ui.actions {

    import controls = colibri.ui.controls;
    import io = colibri.core.io;

    export class OpenNewFileDialogAction extends controls.Action {

        private _initialLocation: io.FilePath;

        constructor() {
            super({
                //text: "New File",
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
                .getExtensions(files.ui.dialogs.NewFileExtension.POINT_ID);

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

        private openFileDialog(extension: ui.dialogs.NewFileExtension) {

            const dlg = extension.createDialog();

            dlg.setTitle(`New ${extension.getWizardName()}`);
            dlg.setInitialFileName(extension.getInitialFileName());
            dlg.setInitialLocation(this._initialLocation ?? extension.getInitialFileLocation());

            dlg.validate();
        }

        setInitialLocation(folder: io.FilePath) {
            this._initialLocation = folder;
        }
    }

    class WizardLabelProvider implements controls.viewers.ILabelProvider {

        getLabel(obj: any): string {
            return (obj as dialogs.NewFileExtension).getWizardName();
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