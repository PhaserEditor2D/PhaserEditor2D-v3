namespace phasereditor2d.scene.core.json {

    export enum SceneType {

        SCENE = "SCENE",
        PREFAB = "PREFAB"
    }

    export declare type SceneData = {

        id: string,
        sceneType: SceneType;
        settings: object,
        displayList: IObjectData[],
        meta: {
            app: string,
            url: string,
            contentType: string
        }
    };

}