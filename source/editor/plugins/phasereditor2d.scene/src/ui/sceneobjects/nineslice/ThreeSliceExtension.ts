namespace phasereditor2d.scene.ui.sceneobjects {

    export class ThreeSliceExtension extends BaseImageExtension {

        private static _instance = new ThreeSliceExtension();

        static getInstance() {

            return this._instance;
        }

        constructor() {
            super({
                phaserTypeName: "Phaser.GameObjects.NineSlice",
                typeName: "ThreeSlice",
                category: SCENE_OBJECT_IMAGE_CATEGORY,
                icon: resources.getIconDescriptor(resources.ICON_3_SLICE)
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

            return new ThreeSliceCodeDOMBuilder();
        }

        protected newObject(scene: Scene, x: number, y: number, key?: string, frame?: string | number) {

            if (key) {

                return new ThreeSlice(scene, x, y, key, frame, 256, 10, 10);
            }

            return new ThreeSlice(scene, x, y, undefined, undefined, 256, 10, 10);
        }
    }
}