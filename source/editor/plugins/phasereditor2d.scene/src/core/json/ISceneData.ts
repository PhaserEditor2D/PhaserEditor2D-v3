namespace phasereditor2d.scene.core.json {

    export enum SceneType {

        SCENE = "SCENE",
        PREFAB = "PREFAB"
    }

    export interface ISceneData {

        id: string;
        sceneType: SceneType;
        settings: object;
        lists?: IObjectListData[];
        displayList: IObjectData[];
        meta: {
            app: string,
            url: string,
            contentType: string
        };
    }

}