namespace phasereditor2d.scene.ui.sceneobjects {

    import code = core.code;

    export class ISceneGameObjectCodeDOMBuilder extends BaseImageCodeDOMBuilder {

        constructor(ISceneGameObjectType: "image"|"sprite") {
            super(ISceneGameObjectType, "physics.add");
        }

        getFactoryMethodName(obj: ArcadeImage): string {

            const defaultFactory = super.getFactoryMethodName(obj);

            if (ArcadeComponent.bodyType.getValue(obj) === Phaser.Physics.Arcade.DYNAMIC_BODY) {

                return defaultFactory;
            }

            if (defaultFactory === "image") {

                return "staticImage";
            }

            return "staticSprite";
        }
    }
}