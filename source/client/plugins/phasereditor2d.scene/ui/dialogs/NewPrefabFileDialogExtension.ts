namespace phasereditor2d.scene.ui.dialogs {

    export class NewPrefabFileDialogExtension extends files.ui.dialogs.NewFileContentExtension {

        constructor() {
            super({
                dialogName: "Prefab File",
                dialogIcon: ScenePlugin.getInstance().getIcon(ICON_GROUP),
                fileExtension: "scene",
                initialFileName: "Prefab",
                fileContent: JSON.stringify({
                    sceneType: core.json.SceneType.PREFAB,
                    displayList: [],
                    meta: {
                        app: "Phaser Editor 2D - Scene Editor",
                        url: "https://phasereditor2d.com",
                        contentType: scene.core.CONTENT_TYPE_SCENE
                    }
                } as core.json.SceneData)
            });
        }

        getInitialFileLocation() {
            return super.findInitialFileLocationBasedOnContentType(scene.core.CONTENT_TYPE_SCENE);
        }
    }
}