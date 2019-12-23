namespace phasereditor2d.files {

    import ide = colibri.ui.ide;
    import controls = colibri.ui.controls;

    export const ICON_NEW_FILE = "file-new";

    export class FilesPlugin extends colibri.Plugin {

        public static getInstance() {
            return this._instance;
        }

        private static _instance = new FilesPlugin();

        private constructor() {
            super("phasereditor2d.files");
        }

        public registerExtensions(reg: colibri.ExtensionRegistry) {

            // icons loader

            reg.addExtension(
                colibri.ui.ide.IconLoaderExtension.withPluginFiles(this, [
                    ICON_NEW_FILE,
                ])
            );

            // new files

            reg.addExtension(
                new ui.dialogs.NewFolderExtension(),
                new ui.dialogs.NewGenericFileExtension());

            // commands

            reg.addExtension(
                new ide.commands.CommandExtension(ui.actions.FilesViewCommands.registerCommands));
        }
    }

    colibri.Platform.addPlugin(FilesPlugin.getInstance());
}