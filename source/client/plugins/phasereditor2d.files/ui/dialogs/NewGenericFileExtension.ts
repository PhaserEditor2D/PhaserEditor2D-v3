namespace phasereditor2d.files.ui.dialogs {

    export class NewGenericFileExtension extends NewFileContentExtension {

        constructor() {
            super({
                fileExtension: "",
                dialogIcon: colibri.Platform.getWorkbench().getWorkbenchIcon(colibri.ui.ide.ICON_FILE),
                initialFileName: "Untitled",
                dialogName: "File"
            });
        }

        createFileContent() {
            return "";
        }
    }
}