namespace phasereditor2d.scene.ui.sceneobjects {

    export class SpriteExtension extends BaseImageExtension {

        private static _instance = new SpriteExtension();

        static getInstance() {
            return this._instance;
        }

        constructor() {
            super({
                phaserTypeName: "Phaser.GameObjects.Sprite",
                typeName: "Sprite",
                category: SCENE_OBJECT_IMAGE_CATEGORY,
                icon: resources.getIconDescriptor(resources.ICON_SPRITE_TYPE)
            });
        }

        override getCodeDOMBuilder(): GameObjectCodeDOMBuilder {

            return new BaseImageCodeDOMBuilder("sprite");
        }

        override acceptsDropData(data: any): boolean {
            
            if (data instanceof pack.core.AnimationConfigInPackItem) {

                return data.getFrames().length > 0;
            }

            return super.acceptsDropData(data);
        }

        override createSceneObjectWithAsset(args: ICreateWithAssetArgs): ISceneGameObject {
            
            const animConfig = args.asset as pack.core.AnimationConfigInPackItem;

            const frames = animConfig.getFrames();

            const frame = frames[0];

            const args2: ICreateWithAssetArgs = {
                ...args,
                asset: frame.getTextureFrame()
            }
            
            const sprite = super.createSceneObjectWithAsset(args2) as Sprite;

            sprite.getEditorSupport().setLabel(animConfig.getKey());

            sprite.animationPlayMethod = AnimationPlayMethod.PLAY;
            sprite.animationKey = animConfig.getKey();

            return sprite;
        }

        protected override newObject(scene: Scene, x: number, y: number, key?: string, frame?: string | number): ISceneGameObject {

            return new Sprite(scene, x, y, key || null, frame);
        }
    }
}