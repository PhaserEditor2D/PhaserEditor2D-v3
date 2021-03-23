namespace phasereditor2d.scene.ui.dialogs {

    export class NewPrefabFileDialogExtension extends files.ui.dialogs.NewFileContentExtension {

        protected getCreatePrefabFileContentFunc(displayList: core.json.IObjectData[]) {

            return (args: files.ui.dialogs.ICreateFileContentArgs) => {

                const settings = ScenePlugin.getInstance().getDefaultSceneSettings();

                const sceneData: core.json.ISceneData = {
                    id: Phaser.Utils.String.UUID(),
                    settings: {
                        createMethodName: "",
                        preloadMethodName: "",
                        compilerOutputLanguage: settings.compilerOutputLanguage,
                        exportClass: settings.exportClass,
                        autoImport: settings.autoImport,
                        compilerInsertSpaces: settings.compilerInsertSpaces,
                        compilerTabSize: settings.compilerTabSize,
                        borderWidth: settings.borderWidth,
                        borderHeight: settings.borderHeight,
                        borderX: settings.borderX,
                        borderY: settings.borderY,
                    },
                    sceneType: core.json.SceneType.PREFAB,
                    displayList,
                    meta: {
                        app: "Phaser Editor 2D - Scene Editor",
                        url: "https://phasereditor2d.com",
                        contentType: scene.core.CONTENT_TYPE_SCENE
                    }
                };

                return JSON.stringify(sceneData, null, 4);
            };
        }

        getCreateFileContentFunc() {

            return this.getCreatePrefabFileContentFunc([]);
        }

        constructor() {
            super({
                dialogName: "Prefab File",
                dialogIconDescriptor: ScenePlugin.getInstance().getIconDescriptor(ICON_GROUP),
                fileExtension: "scene",
                initialFileName: "Prefab"
            });
        }

        getInitialFileLocation() {
            return super.findInitialFileLocationBasedOnContentType(scene.core.CONTENT_TYPE_SCENE);
        }
    }
}