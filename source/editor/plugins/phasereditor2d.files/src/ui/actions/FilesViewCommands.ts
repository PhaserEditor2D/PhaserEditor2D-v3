namespace phasereditor2d.files.ui.actions {

    import controls = colibri.ui.controls;

    export const CMD_NEW_FILE = "phasereditor2d.files.ui.actions.NewFile";
    export const CMD_GO_TO_FILE = "phasereditor2d.files.ui.actions.GoToFile";
    export const CAT_FILES = "phasereditor2d.fines.ui.actions.FilesCategory";

    function isFilesViewScope(args: colibri.ui.ide.commands.HandlerArgs) {
        return args.activePart instanceof views.FilesView;
    }

    export class FilesViewCommands {

        static registerCommands(manager: colibri.ui.ide.commands.CommandManager) {

            manager.addCategory({
                id: CAT_FILES,
                name: "Files"
            });

            // new file

            manager.addCommandHelper({
                id: CMD_NEW_FILE,
                name: "New File",
                tooltip: "Create new content.",
                category: CAT_FILES
            });

            manager.addHandlerHelper(CMD_NEW_FILE,
                OpenNewFileDialogAction.commandTest,
                args => {
                    new OpenNewFileDialogAction().run();
                });

            manager.addKeyBinding(CMD_NEW_FILE, new colibri.ui.ide.commands.KeyMatcher({
                control: true,
                alt: true,
                key: "KeyN",
                filterInputElements: false
            }));

            // delete file

            manager.addHandlerHelper(colibri.ui.ide.actions.CMD_DELETE,

                args => isFilesViewScope(args) && DeleteFilesAction.isEnabled(args.activePart as views.FilesView),

                args => {
                    new DeleteFilesAction(args.activePart as views.FilesView).run();
                });

            // rename file

            manager.addHandlerHelper(colibri.ui.ide.actions.CMD_RENAME,

                args => isFilesViewScope(args) && RenameFileAction.isEnabled(args.activePart as views.FilesView),

                args => {
                    new RenameFileAction(args.activePart as views.FilesView).run();
                });

            // go to file

            manager.add({
                command: {
                    id: CMD_GO_TO_FILE,
                    name: "Go To File",
                    tooltip: "Search for a file and open it in the default editor",
                    category: CAT_FILES
                },
                keys: {
                    control: true,
                    key: "KeyP"
                },
                handler: {
                    executeFunc: args => {

                        const viewer = new controls.viewers.TreeViewer("phasereditor2d.files.ui.actions.GoToFile");
                        viewer.setContentProvider(new controls.viewers.ArrayTreeContentProvider());
                        viewer.setStyledLabelProvider(new viewers.OpenFileLabelProvider());
                        viewer.setCellRendererProvider(new viewers.FileCellRendererProvider());

                        viewer.setInput(colibri.ui.ide.FileUtils.getAllFiles()

                            .filter(f => f.isFile())

                            .sort((a, b) => -(a.getModTime() - b.getModTime())));

                        const dlg = new controls.dialogs.ViewerDialog(viewer, true);

                        dlg.setSize(dlg.getSize().width * 1.5, dlg.getSize().height * 1.5);

                        dlg.create();

                        dlg.setTitle("Go To File");

                        dlg.addOpenButton("Open", sel => {

                            if (sel.length > 0) {

                                const file = sel[0] as colibri.core.io.FilePath;

                                colibri.Platform.getWorkbench().openEditor(file);
                            }
                        });
                    }
                }
            })
        }
    }
}