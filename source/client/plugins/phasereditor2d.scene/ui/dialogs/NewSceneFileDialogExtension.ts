namespace phasereditor2d.scene.ui.dialogs {

    export class NewSceneFileDialogExtension extends files.ui.dialogs.NewFileContentExtension {

        constructor() {
            super({
                id: "phasereditor2d.scene.ui.wizards.NewSceneFileWizardExtension",
                wizardName: "Scene File",
                icon: ScenePlugin.getInstance().getIcon(ICON_GROUP),
                fileExtension: "scene",
                initialFileName: "Scene",
                fileContent: JSON.stringify({
                    sceneType: "Scene",
                    displayList: [],
                    meta: {
                        app: "Phaser Editor 2D - Scene Editor",
                        url: "https://phasereditor2d.com",
                        contentType: scene.core.CONTENT_TYPE_SCENE
                    }
                })
            });
        }

        getInitialFileLocation() {
            return super.findInitialFileLocationBasedOnContentType(scene.core.CONTENT_TYPE_SCENE);
        }
    }
}

/*

`{
                    "sceneType": "Scene",
                    "displayList": [],
                    "meta": {

                    }
                }`

                */