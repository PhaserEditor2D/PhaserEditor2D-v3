namespace phasereditor2d.scene.ui.dialogs {

    export class NewPrefabFileDialogExtension extends files.ui.dialogs.NewFileContentExtension {

        createFileContent(): string {

            const sceneData: core.json.ISceneData = {
                id: Phaser.Utils.String.UUID(),
                settings: {
                    createMethodName: "",
                    preloadMethodName: ""
                },
                sceneType: core.json.SceneType.PREFAB,
                displayList: [],
                meta: {
                    app: "Phaser Editor 2D - Scene Editor",
                    url: "https://phasereditor2d.com",
                    contentType: scene.core.CONTENT_TYPE_SCENE
                }
            };

            return JSON.stringify(sceneData, null, 4);
        }

        constructor() {
            super({
                dialogName: "Prefab File",
                dialogIcon: ScenePlugin.getInstance().getIcon(ICON_GROUP),
                fileExtension: "scene",
                initialFileName: "Prefab"
            });
        }

        getInitialFileLocation() {
            return super.findInitialFileLocationBasedOnContentType(scene.core.CONTENT_TYPE_SCENE);
        }
    }
}