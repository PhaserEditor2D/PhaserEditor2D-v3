namespace phasereditor2d.scene.ui.json {

    export declare type SceneType = "Scene" | "Prefab";

    export declare type SceneData = {
        sceneType: SceneType,
        displayList: any[],
        meta: {
            app: string,
            url: string,
            contentType: string
        }
    };

}