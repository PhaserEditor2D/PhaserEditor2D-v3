namespace phasereditor2d.scene.ui.sceneobjects {

    export interface IFXObjectFactory {

        extension: FXObjectExtension;
        
        factoryName: string;

        createFXObject(scene: Scene, parent: ISceneGameObject, preFX: boolean): FXObject;
    }
}