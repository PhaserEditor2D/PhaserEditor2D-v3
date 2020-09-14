namespace phasereditor2d.files.ui.dialogs {

    export class NewGenericFileExtension extends NewFileContentExtension {

        constructor() {
            super({
                fileExtension: "",
                dialogIconDescriptor: colibri.ColibriPlugin.getInstance().getIconDescriptor(colibri.ICON_FILE),
                initialFileName: "Untitled",
                dialogName: "File"
            });
        }

        getCreateFileContentFunc() {
            return args => "";
        }
    }
}