namespace phasereditor2d.scene.ui.sceneobjects {

    export class ArcadeImageCodeDOMBuilder extends BaseImageCodeDOMBuilder {

        constructor() {
            super("image", "physics.add");
        }

        getFactoryMethodName(obj: ArcadeImage): string {
            
            if (ArcadeComponent.bodyType.getValue(obj) === Phaser.Physics.Arcade.DYNAMIC_BODY) {

                return "image";
            }

            return "staticImage";
        }
    }
}