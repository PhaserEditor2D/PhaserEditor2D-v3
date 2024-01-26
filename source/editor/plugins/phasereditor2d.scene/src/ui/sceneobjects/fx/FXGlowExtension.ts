/// <reference path="./FXObjectExtension.ts" />

namespace phasereditor2d.scene.ui.sceneobjects {

    export class FXGlowExtension extends FXObjectExtension {

        private static _instance = new FXGlowExtension();

        static getInstance() {

            return this._instance;
        }

        constructor() {
            super({
                typeName: "Glow",
                phaserTypeName: "Phaser.FX.Glow",
                category: SCENE_OBJECT_FX_CATEGORY,
                icon: resources.getIconDescriptor(resources.ICON_BUILD)
            });
        }

        override createGameObjectWithData(args: ICreateWithDataArgs): ISceneGameObject {

            throw new Error("Method not supported.");
        }

        override getCodeDOMBuilder(): GameObjectCodeDOMBuilder {

            throw new Error("Method not implemented.");
        }

        override createFXObject(scene: Scene, parent: ISceneGameObject, preFX: boolean) {
                
            const obj = new FXGlow(scene, parent, preFX);

            scene.removeGameObject(obj);

            return obj;
        }

        override createDefaultSceneObject(args: ICreateDefaultArgs): ISceneObject[] {

            throw new Error("Method not supported.");
        }
    }
}