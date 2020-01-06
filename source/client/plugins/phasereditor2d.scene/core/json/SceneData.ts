namespace phasereditor2d.scene.core.json {

    export declare type SceneType = "Scene" | "Prefab";

    export declare type SceneData = {
        id: string,
        sceneType: SceneType;
        settings: object,
        displayList: ObjectData[],
        meta: {
            app: string,
            url: string,
            contentType: string
        }
    };

}