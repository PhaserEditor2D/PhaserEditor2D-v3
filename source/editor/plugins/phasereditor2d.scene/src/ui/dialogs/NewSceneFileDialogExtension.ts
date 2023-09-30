namespace phasereditor2d.scene.ui.dialogs {

    import io = colibri.core.io;

    export class NewSceneFileDialogExtension extends files.ui.dialogs.NewFileContentExtension {

        constructor() {
            super({
                dialogName: "Scene File",
                dialogIconDescriptor: resources.getIconDescriptor(resources.ICON_GROUP),
                fileExtension: "scene",
                initialFileName: "Scene"
            });

            this.setCreatedCallback(file => this.compileTypeScriptFile(file));
        }

        private compileTypeScriptFile(file: io.FilePath) {

            console.log(`Compiling scene ${file.getName()}`);

            core.code.SceneCompileAllExtension.compileSceneFile(file);
        }

        getCreateFileContentFunc() {

            return (args: files.ui.dialogs.ICreateFileContentArgs) => {

                let name = args.fileName;

                const i = name.lastIndexOf(".");

                if (i > 0) {

                    name = name.substring(0, i);
                }

                const settings = ScenePlugin.getInstance().getDefaultSceneSettings();

                const sceneData: core.json.ISceneData = {
                    id: Phaser.Utils.String.UUID(),
                    settings: {
                        compilerOutputLanguage: settings.compilerOutputLanguage,
                        javaScriptInitFieldsInConstructor: settings.javaScriptInitFieldsInConstructor,
                        exportClass: settings.exportClass,
                        autoImport: settings.autoImport,
                        createMethodName: "editorCreate",
                        compilerInsertSpaces: settings.compilerInsertSpaces,
                        compilerTabSize: settings.compilerTabSize,
                        borderWidth: settings.borderWidth,
                        borderHeight: settings.borderHeight,
                        borderX: settings.borderX,
                        borderY: settings.borderY,
                        sceneKey: name,
                    },
                    sceneType: core.json.SceneType.SCENE,
                    displayList: [],
                    meta: {
                        app: "Phaser Editor 2D - Scene Editor",
                        url: "https://phasereditor2d.com",
                        contentType: scene.core.CONTENT_TYPE_SCENE
                    }
                };

                return JSON.stringify(sceneData, null, 2);
            };
        }

        getInitialFileLocation() {

            return super.findInitialFileLocationBasedOnContentType(scene.core.CONTENT_TYPE_SCENE);
        }
    }
}