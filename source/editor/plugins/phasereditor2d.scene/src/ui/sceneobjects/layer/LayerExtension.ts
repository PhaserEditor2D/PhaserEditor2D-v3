namespace phasereditor2d.scene.ui.sceneobjects {

    import json = phasereditor2d.scene.core.json;

    export class LayerExtension extends SceneGameObjectExtension {

        private static _instance: LayerExtension;

        static getInstance() {

            return this._instance ? this._instance : (this._instance = new LayerExtension());
        }

        constructor() {
            super({
                category: SCENE_OBJECT_GROUPING_CATEGORY,
                icon: resources.getIconDescriptor(resources.ICON_LAYER),
                phaserTypeName: "Phaser.GameObjects.Layer",
                typeName: "Layer"
            });
        }

        adaptDataAfterTypeConversion(serializer: json.Serializer, originalObject: ISceneGameObject, extraData: any) {

            if (originalObject instanceof Container) {

                const containerData = serializer.getData();

                const children = originalObject.getEditorSupport().getObjectChildren();

                // tslint:disable-next-line:prefer-for-of
                for (let i = 0; i < children.length; i++) {

                    const child = children[i];

                    if (child.getEditorSupport().hasComponent(TransformComponent)) {

                        const sprite = child as any as Phaser.GameObjects.Sprite;
                        const p = new Phaser.Math.Vector2();
                        sprite.getWorldTransformMatrix().transformPoint(0, 0, p);

                        const spriteData = containerData.list[i];

                        if (spriteData) {

                            spriteData["x"] = p.x;
                            spriteData["y"] = p.y;
                        }
                    }
                }
            }
        }

        acceptsDropData(data: any): boolean {

            return false;
        }

        createSceneObjectWithAsset(args: ICreateWithAssetArgs): ISceneGameObject {

            return null;
        }

        createGameObjectWithData(args: ICreateWithDataArgs): sceneobjects.ISceneGameObject {

            const container = this.createLayerObject(args.scene, []);

            container.getEditorSupport().readJSON(args.data);

            return container;
        }

        private createLayerObject(scene: Scene, list: sceneobjects.ISceneGameObject[]) {

            const layer = new sceneobjects.Layer(scene, list);

            layer.getEditorSupport().setScene(scene);

            scene.addGameObject(layer);

            return layer;
        }

        async getAssetsFromObjectData(args: IGetAssetsFromObjectArgs): Promise<any[]> {

            return ContainerExtension.getAssetsFromNestedData(args);
        }

        createDefaultSceneObject(args: ICreateDefaultArgs): ISceneObject[] {

            return [this.createLayerObject(args.scene, [])];
        }

        getCodeDOMBuilder(): GameObjectCodeDOMBuilder {

            return LayerCodeDOMBuilder.getInstance();
        }
    }
}