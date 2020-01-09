namespace phasereditor2d.scene.ui.dialogs {

    export class NewSceneFileDialogExtension extends files.ui.dialogs.NewFileContentExtension {

        private static createSceneData(): core.json.SceneData {
            return {
                id: Phaser.Utils.String.UUID(),
                settings: {},
                sceneType: core.json.SceneType.SCENE,
                displayList: [],
                meta: {
                    app: "Phaser Editor 2D - Scene Editor",
                    url: "https://phasereditor2d.com",
                    contentType: scene.core.CONTENT_TYPE_SCENE
                }
            };
        }

        constructor() {
            super({
                dialogName: "Scene File",
                dialogIcon: ScenePlugin.getInstance().getIcon(ICON_GROUP),
                fileExtension: "scene",
                initialFileName: "Scene",
                fileContent: JSON.stringify(NewSceneFileDialogExtension.createSceneData())
            });
        }

        getInitialFileLocation() {
            return super.findInitialFileLocationBasedOnContentType(scene.core.CONTENT_TYPE_SCENE);
        }
    }
}