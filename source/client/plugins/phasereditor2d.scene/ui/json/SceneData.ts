namespace phasereditor2d.scene.ui.json {

    export declare type SceneType = "Scene" | "Prefab";

    export declare type SceneData = {
        id: string,
        sceneType: SceneType,
        displayList: ObjectData[],
        meta: {
            app: string,
            url: string,
            contentType: string
        }
    };

}