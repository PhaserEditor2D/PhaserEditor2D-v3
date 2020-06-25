namespace phasereditor2d.scene.ui.dialogs {

    export class NewObjectScriptFileDialogExtension extends files.ui.dialogs.NewFileContentExtension {

        constructor() {
            super({
                dialogName: "Object Scripts File",
                dialogIcon: ScenePlugin.getInstance().getIcon(ICON_OBJECT_SCRIPT),
                fileExtension: "scripts",
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

                const data = {
                    meta: {
                        app: "Phaser Editor 2D - Object Script Editor",
                        url: "https://phasereditor2d.com",
                        contentType: scene.core.CONTENT_TYPE_SCENE
                    }
                };

                return JSON.stringify(data, null, 2);
            };
        }

        getInitialFileLocation() {

            return super.findInitialFileLocationBasedOnContentType(scene.core.CONTENT_TYPE_OBJECT_SCRIPT);
        }
    }
}