namespace phasereditor2d.scene.ui.dialogs {

    export class NewUserComponentsFileDialogExtension extends files.ui.dialogs.NewFileContentExtension {

        constructor() {
            super({
                dialogName: "User Components File",
                dialogIcon: ScenePlugin.getInstance().getIcon(ICON_USER_COMPONENT),
                fileExtension: "components",
                initialFileName: "Object"
            });
        }

        getCreateFileContentFunc() {

            return (args: files.ui.dialogs.ICreateFileContentArgs) => {

                let name = args.fileName;

                const i = name.lastIndexOf(".");

                if (i > 0) {

                    name = name.substring(0, i);
                }

                const model = new editor.usercomponent.UserComponentsModel();

                const data = model.toJSON();

                return JSON.stringify(data, null, 2);
            };
        }

        getInitialFileLocation() {

            return super.findInitialFileLocationBasedOnContentType(scene.core.CONTENT_TYPE_USER_COMPONENTS);
        }
    }
}