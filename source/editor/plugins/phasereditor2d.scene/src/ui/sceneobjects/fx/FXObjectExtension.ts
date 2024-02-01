namespace phasereditor2d.scene.ui.sceneobjects {

    export abstract class FXObjectExtension extends SceneGameObjectExtension {

        static isDefaultPipelinePreFX(parent: ISceneGameObject) {

            return parent instanceof Phaser.GameObjects.Sprite
                || parent instanceof Phaser.GameObjects.Image
                || parent instanceof Phaser.GameObjects.Text
                || parent instanceof Phaser.GameObjects.TileSprite
                || parent instanceof Phaser.GameObjects.RenderTexture
                || parent instanceof Phaser.GameObjects.Video;
        }

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