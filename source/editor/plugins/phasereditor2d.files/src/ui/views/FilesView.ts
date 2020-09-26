
namespace phasereditor2d.files.ui.views {

    import controls = colibri.ui.controls;
    import ide = colibri.ui.ide;
    import io = colibri.core.io;

    export class FilesView extends ide.ViewerView {

        static ID = "phasereditor2d.files.ui.views.FilesView";
        static MENU_ID = "phasereditor2d.files.ui.views.FilesView#ContextMenu";

        private _propertyProvider = new FilePropertySectionProvider();

        constructor() {
            super(FilesView.ID);

            this.setTitle("Files");

            this.setIcon(ide.Workbench.getWorkbench().getWorkbenchIcon(colibri.ICON_FOLDER));
        }

        protected createViewer() {

            return new controls.viewers.TreeViewer(FilesView.ID);
        }

        fillContextMenu(menu: controls.Menu) {

            menu.addMenu(this.createNewFileMenu());

            menu.addMenu(this.createOpenWithMenu());

            menu.addSeparator();

            menu.add(new actions.RenameFileAction(this));

            menu.add(new actions.MoveFilesAction(this));

            menu.add(new actions.CopyFilesAction(this));

            menu.add(new actions.DeleteFilesAction(this));

            menu.addSeparator();

            menu.addExtension(FilesView.MENU_ID);

            menu.addSeparator();

            menu.add(new actions.UploadFilesAction(this));
        }

        createOpenWithMenu(): controls.Menu {

            const menu = new controls.Menu("Open With");

            const reg = colibri.Platform.getWorkbench().getEditorRegistry();

            const sel = this.getViewer().getSelection();
            const file = sel.length === 1 && sel[0] instanceof io.FilePath ? sel[0] : undefined;

            const factories: colibri.ui.ide.EditorFactory[] = [];

            const defaultFactory = reg.getDefaultFactory();

            const registeredFactory = file ? reg.getFactoryForInput(file) : undefined;

            if (registeredFactory !== defaultFactory) {

                factories.push(registeredFactory);
            }

            factories.push(defaultFactory);

            factories.push(...reg.getFactories().filter(f => f !== defaultFactory && f !== registeredFactory));

            for (const factory of factories) {

                menu.addAction({
                    text: factory.getName(),
                    enabled: file !== undefined,
                    callback: () => colibri.Platform.getWorkbench().openEditor(file, factory)
                });

                if (factory === defaultFactory) {

                    menu.addSeparator();
                }
            }

            return menu;
        }

        private createNewFileMenu() {

            const menu = new controls.Menu("New...");

            const extensions = colibri.Platform.getExtensionRegistry()
                .getExtensions<dialogs.NewDialogExtension>(files.ui.dialogs.NewDialogExtension.POINT_ID);

            for (const ext of extensions) {

                menu.add(new controls.Action({
                    text: ext.getDialogName(),
                    icon: ext.getDialogIcon(),
                    callback: () => {

                        const sel = this.getViewer().getSelectionFirstElement();
                        let loc = sel ? sel as io.FilePath : colibri.Platform.getWorkbench().getProjectRoot();

                        if (loc.isFile()) {

                            loc = loc.getParent();
                        }

                        const dlg = ext.createDialog({
                            initialFileLocation: loc
                        });

                        dlg.setTitle(`New ${ext.getDialogName()}`);
                    }
                }));
            }

            return menu;
        }

        getPropertyProvider() {
            return this._propertyProvider;
        }

        protected createPart(): void {

            super.createPart();

            const wb = ide.Workbench.getWorkbench();

            const root = wb.getProjectRoot();

            const viewer = this._viewer;

            viewer.setLabelProvider(new viewers.FileLabelProvider());
            viewer.setContentProvider(new viewers.FileTreeContentProvider());
            viewer.setCellRendererProvider(new viewers.FileCellRendererProvider());
            viewer.setInput(root);

            viewer.repaint();

            viewer.eventOpenItem.addListener((file: io.FilePath) => {

                if (file.isFolder()) {

                    return;
                }

                wb.openEditor(file);
            });

            wb.getFileStorage().addChangeListener(change => this.onFileStorageChange(change));

            wb.eventEditorActivated.addListener(() => {

                const editor = wb.getActiveEditor();

                if (editor) {

                    const input = editor.getInput();

                    if (input instanceof io.FilePath) {

                        // gives it a time because other listeners need to do their job.
                        viewer.setSelection([input]);
                        viewer.reveal(input);
                    }
                }
            });
        }

        private async onFileStorageChange(change: io.FileStorageChange) {

            const viewer = this.getViewer();

            const oldSelection = this.getViewer().getSelection();

            viewer.setInput(ide.FileUtils.getRoot());

            await viewer.repaint();

            if (oldSelection.length > 0) {

                const newSelection = oldSelection

                    .map(obj => obj as io.FilePath)

                    .filter(file => {

                        const file2 = colibri.ui.ide.FileUtils.getFileFromPath(file.getFullName());

                        return file2 !== null;
                    });

                if (newSelection.length !== oldSelection.length) {
                    this.getViewer().setSelection(newSelection);
                    this.getViewer().repaint();
                }
            }
        }

        getIcon() {
            return colibri.ColibriPlugin.getInstance().getIcon(colibri.ICON_FOLDER);
        }
    }
}