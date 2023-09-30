namespace phasereditor2d.scene.ui.sceneobjects {

    export class TileSpriteExtension extends BaseImageExtension {

        private static _instance = new TileSpriteExtension();

        static getInstance() {
            return this._instance;
        }

        constructor() {
            super({
                phaserTypeName: "Phaser.GameObjects.TileSprite",
                typeName: "TileSprite",
                category: SCENE_OBJECT_IMAGE_CATEGORY,
                icon: resources.getIconDescriptor(resources.ICON_TILESPRITE_TYPE)
            });
        }

        adaptDataAfterTypeConversion(serializer: core.json.Serializer, originalObject: ISceneGameObject, extraData: any) {

            super.adaptDataAfterTypeConversion(serializer, originalObject, extraData);

            const obj = originalObject as unknown as Phaser.GameObjects.Components.ComputedSize;

            const width = obj.width === undefined ? 20 : obj.width;
            const height = obj.height === undefined ? 20 : obj.height;

            serializer.getData()[SizeComponent.width.name] = width;
            serializer.getData()[SizeComponent.height.name] = height;
        }

        getCodeDOMBuilder(): GameObjectCodeDOMBuilder {

            return new TileSpriteCodeDOMBuilder();
        }

        protected newObject(scene: Scene, x: number, y: number, key?: string, frame?: string | number): ISceneGameObject {

            if (key) {

                return new TileSprite(scene, x, y, 0, 0, key, frame);
            }

            return new TileSprite(scene, x, y, 64, 64, null, null);
        }
    }
}