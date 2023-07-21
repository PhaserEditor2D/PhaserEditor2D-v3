namespace phasereditor2d.animations.ui.dialogs {

    export class NewAnimationsFileExtension extends files.ui.dialogs.NewFileContentExtension {

        constructor() {
            super({
                dialogName: "Animations File",
                dialogIconDescriptor: resources.getIconDescriptor(resources.ICON_ANIMATIONS),
                fileExtension: "json",
                initialFileName: "animations"
            });
        }

        getCreateFileContentFunc(): (args: files.ui.dialogs.ICreateFileContentArgs) => string {

            const model = new editors.AnimationsModel();
            
            const animsData = model.toJSON(undefined);

            return _ => JSON.stringify(animsData, null, 4);
        }
    }
}