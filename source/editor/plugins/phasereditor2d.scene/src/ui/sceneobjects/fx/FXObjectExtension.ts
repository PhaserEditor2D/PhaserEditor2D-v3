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

        createInitObjectDataFromChild(childData: core.json.IObjectData): core.json.IObjectData {
            
            const data = super.createInitObjectDataFromChild(childData) as any;

            data.preFX = (childData as any).preFX;

            return data;
        }

        abstract createFXObject(scene: Scene, parent: ISceneGameObject, preFX: boolean): FXObject;
    }
}