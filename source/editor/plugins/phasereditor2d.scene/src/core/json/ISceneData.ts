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
        codeSnippets?: ui.codesnippets.ICodeSnippetData[];
        meta: {
            app: string,
            url: string,
            contentType: string,
            version?: number
        };
    }

}