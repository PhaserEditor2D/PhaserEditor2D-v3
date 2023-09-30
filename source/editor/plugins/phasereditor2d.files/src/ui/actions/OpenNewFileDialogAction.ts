namespace phasereditor2d.files.ui.actions {

    import controls = colibri.ui.controls;
    import io = colibri.core.io;

    export class OpenNewFileDialogAction extends controls.Action {

        private _initialLocation: io.FilePath;

        constructor() {
            super({
                commandId: CMD_NEW_FILE,
                showText: false,
                icon: resources.getIcon(resources.ICON_NEW_FILE)
            });
        }

        static commandTest(args: colibri.ui.ide.commands.HandlerArgs): boolean {

            const root = colibri.ui.ide.FileUtils.getRoot();

            return root !== null && !args.activeDialog;
        }

        async run() {

            const viewer = new controls.viewers.TreeViewer("phasereditor2d.files.ui.actions.OpenNewFileDialogAction");

            viewer.setLabelProvider(new WizardLabelProvider());
            viewer.setContentProvider(new controls.viewers.ArrayTreeContentProvider());
            viewer.setCellRendererProvider(new WizardCellRendererProvider());

            const extensions = colibri.Platform.getExtensionRegistry()
                .getExtensions(files.ui.dialogs.NewDialogExtension.POINT_ID);

            viewer.setInput(extensions);

            const dlg = new controls.dialogs.ViewerDialog(viewer, false);

            dlg.create();

            dlg.setTitle("New");

            {
                const selectCallback = () => {

                    dlg.close();

                    this.openDialog(viewer.getSelectionFirstElement());
                };

                const btn = dlg.addButton("Select", () => selectCallback());

                btn.disabled = true;

                viewer.eventSelectionChanged.addListener(() => {

                    btn.disabled = viewer.getSelection().length !== 1;
                });

                viewer.eventOpenItem.addListener(() => selectCallback());
            }

            dlg.addButton("Cancel", () => dlg.close());
        }

        private openDialog(extension: ui.dialogs.NewDialogExtension) {

            const dlg = extension.createDialog({
                initialFileLocation: this._initialLocation
            });

            dlg.setTitle(`New ${extension.getDialogName()}`);

            // const ext = extension as dialogs.NewFileExtension;
            // dlg.setInitialFileName(ext.getInitialFileName());
            // dlg.setInitialLocation(this._initialLocation ?? ext.getInitialFileLocation());
            // dlg.validate();
        }

        setInitialLocation(folder: io.FilePath) {
            this._initialLocation = folder;
        }
    }

    class WizardLabelProvider implements controls.viewers.ILabelProvider {

        getLabel(obj: any): string {
            return (obj as dialogs.NewDialogExtension).getDialogName();
        }
    }

    class WizardCellRendererProvider implements controls.viewers.ICellRendererProvider {

        getCellRenderer(element: any): controls.viewers.ICellRenderer {

            const ext = element as dialogs.NewDialogExtension;

            return new controls.viewers.IconImageCellRenderer(ext.getDialogIcon());
        }

        preload(args: controls.viewers.PreloadCellArgs): Promise<controls.PreloadResult> {
            return controls.Controls.resolveNothingLoaded();
        }
    }
}