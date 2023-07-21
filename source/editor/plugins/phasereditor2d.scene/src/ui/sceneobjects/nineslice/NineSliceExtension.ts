namespace phasereditor2d.scene.ui.sceneobjects {

    export class NineSliceExtension extends BaseImageExtension {

        private static _instance = new NineSliceExtension();

        static getInstance() {

            return this._instance;
        }

        constructor() {
            super({
                phaserTypeName: "Phaser.GameObjects.NineSlice",
                typeName: "NineSlice",
                category: SCENE_OBJECT_IMAGE_CATEGORY,
                icon: resources.getIconDescriptor(resources.ICON_9_SLICE)
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

            return new NineSliceCodeDOMBuilder();
        }

        protected newObject(scene: Scene, x: number, y: number, key?: string, frame?: string | number): ISceneGameObject {

            if (key) {

                return new NineSlice(scene, x, y, key, frame, 256, 256, 10, 10, 10, 10);
            }

            return new NineSlice(scene, x, y, undefined, undefined, 256, 256, 10, 10, 10, 10);
        }
    }
}