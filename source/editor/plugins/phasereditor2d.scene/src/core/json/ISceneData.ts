namespace phasereditor2d.scene.core.json {

    export enum SceneType {

        SCENE = "SCENE",
        PREFAB = "PREFAB"
    }

    export interface ISceneData {

        id: string;
        sceneType: SceneType;
        settings: any;
        lists?: IObjectListData[];
        plainObjects?: IScenePlainObjectData[];
        displayList: IObjectData[];
        prefabProperties?: any[];
        meta: {
            app: string,
            url: string,
            contentType: string
        };
    }

}