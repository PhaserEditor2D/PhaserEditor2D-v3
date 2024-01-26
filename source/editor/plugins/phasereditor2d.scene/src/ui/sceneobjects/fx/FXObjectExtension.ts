namespace phasereditor2d.scene.ui.sceneobjects {

    export abstract class FXObjectExtension extends SceneGameObjectExtension {

        acceptsDropData(data: any): boolean {
            
            return false;
        }

        createSceneObjectWithAsset(args: ICreateWithAssetArgs): ISceneGameObject {
            // not supported
            return null;
        }

        async getAssetsFromObjectData(args: IGetAssetsFromObjectArgs): Promise<any[]> {
            
            return [];
        }

        abstract createFXObject(scene: Scene, parent: ISceneGameObject, preFX: boolean): FXObject;
    }
}