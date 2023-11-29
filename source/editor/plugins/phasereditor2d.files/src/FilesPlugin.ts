namespace phasereditor2d.files {

    import ide = colibri.ui.ide;

    export class FilesPlugin extends colibri.Plugin {

        private static _instance = new FilesPlugin();
        private _openFileAction: (file: colibri.core.io.FilePath) => void;

        static getInstance() {

            return this._instance;
        }

        private constructor() {
            super("phasereditor2d.files");
        }

        setOpenFileAction(action: (file: colibri.core.io.FilePath) => void) {

            this._openFileAction = action;
        }

        getOpenFileAction() {

            return this._openFileAction;
        }

        getFileStyledLabelExtensions(): ui.viewers.StyledFileLabelProviderExtension[] {

            return colibri.Platform.getExtensions(
                ui.viewers.StyledFileLabelProviderExtension.POINT_ID);
        }

        public registerExtensions(reg: colibri.ExtensionRegistry) {

            // new files

            reg.addExtension(
                new ui.dialogs.NewFolderExtension(),
                new ui.dialogs.NewGenericFileExtension());

            // commands

            reg.addExtension(
                new ide.commands.CommandExtension(ui.actions.FilesViewCommands.registerCommands));

            // properties

            reg.addExtension(new ui.views.FilePropertySectionExtension(
                page => new ui.views.FileSection(page),
                page => new ui.views.ImageFileSection(page),
                page => new ui.views.ManyImageFileSection(page),
                page => new ui.views.UploadSection(page),
            ));

            // sections

            reg.addExtension(new ui.views.ContentTypeSectionExtension(
                {
                    contentType: webContentTypes.core.CONTENT_TYPE_AUDIO,
                    section: ui.views.TAB_SECTION_ASSETS
                },
                {
                    contentType: webContentTypes.core.CONTENT_TYPE_IMAGE,
                    section: ui.views.TAB_SECTION_ASSETS
                },
                {
                    contentType: webContentTypes.core.CONTENT_TYPE_SVG,
                    section: ui.views.TAB_SECTION_ASSETS
                },
                {
                    contentType: webContentTypes.core.CONTENT_TYPE_VIDEO,
                    section: ui.views.TAB_SECTION_ASSETS
                }));
        }
    }

    colibri.Platform.addPlugin(FilesPlugin.getInstance());
}