/// <reference path="./NewDialogExtension.ts" />

namespace phasereditor2d.files.ui.dialogs {

    import controls = colibri.ui.controls;
    import io = colibri.core.io;

    export abstract class NewFileExtension extends NewDialogExtension {

        private _initialFileName: string;

        constructor(config: {
            dialogName: string,
            dialogIconDescriptor: controls.IconDescriptor,
            initialFileName: string
        }) {
            super(config);

            this._initialFileName = config.initialFileName;
        }

        getInitialFileName() {
            return this._initialFileName;
        }

        getInitialFileLocation(): io.FilePath {
            return colibri.Platform.getWorkbench().getProjectRoot();
        }

        findInitialFileLocationBasedOnContentType(contentType: string) {

            const root = colibri.Platform.getWorkbench().getProjectRoot();

            const files: io.FilePath[] = [];

            root.flatTree(files, false);

            const reg = colibri.Platform.getWorkbench().getContentTypeRegistry();

            const targetFiles = files.filter(file => contentType === reg.getCachedContentType(file));

            if (targetFiles.length > 0) {

                targetFiles.sort((a, b) => {
                    return b.getModTime() - a.getModTime();
                });

                return targetFiles[0].getParent();
            }

            return root;
        }
    }
}