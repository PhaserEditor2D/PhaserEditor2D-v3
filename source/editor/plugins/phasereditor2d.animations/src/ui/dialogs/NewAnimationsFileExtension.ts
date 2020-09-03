namespace phasereditor2d.animations.ui.dialogs {

    export class NewAnimationsFileExtension extends files.ui.dialogs.NewFileContentExtension {

        constructor() {
            super({
                dialogName: "Animations File",
                dialogIcon: AnimationsPlugin.getInstance().getIcon(pack.ICON_ANIMATIONS),
                fileExtension: "json",
                initialFileName: "animations"
            });
        }

        getCreateFileContentFunc(): (args: files.ui.dialogs.ICreateFileContentArgs) => string {

            return _ => JSON.stringify({
                anims: [],
                meta: AnimationsPlugin.getInstance().createAnimationsMetaData()
            }, null, 4);
        }
    }
}