namespace phasereditor2d.files.ui.actions {

    import controls = colibri.ui.controls;

    export const CMD_NEW_FILE = "phasereditor2d.files.ui.actions.newFile";
    export const CAT_NEW_FILE = "phasereditor2d.fines.ui.actions.NewFileCategory";

    function isFilesViewScope(args: colibri.ui.ide.commands.HandlerArgs) {
        return args.activePart instanceof views.FilesView;
    }

    export class FilesViewCommands {

        static registerCommands(manager: colibri.ui.ide.commands.CommandManager) {

            manager.addCategory({
                id: CAT_NEW_FILE,
                name: "New File"
            });

            // new file

            manager.addCommandHelper({
                id: CMD_NEW_FILE,
                name: "New File",
                tooltip: "Create new content.",
                category: CAT_NEW_FILE
            });

            manager.addHandlerHelper(CMD_NEW_FILE,
                OpenNewFileDialogAction.commandTest,
                args => {
                    new OpenNewFileDialogAction().run();
                });

            manager.addKeyBinding(CMD_NEW_FILE, new colibri.ui.ide.commands.KeyMatcher({
                control: true,
                alt: true,
                key: "N",
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
        }
    }
}