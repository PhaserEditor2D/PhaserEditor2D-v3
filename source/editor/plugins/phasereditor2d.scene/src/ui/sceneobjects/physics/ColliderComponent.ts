/// <reference path="../PlainObjectComponent.ts" />
namespace phasereditor2d.scene.ui.sceneobjects {

    export class ColliderComponent extends PlainObjectComponent<Collider> {

        static object1 = SimpleProperty("object1", "", "Object 1", "phaser:Phaser.Physics.Arcade.Collider(object1)", true);
        static object2 = SimpleProperty("object2", "", "Object 2", "phaser:Phaser.Physics.Arcade.Collider(object2)", true);
        static overlapOnly = SimpleProperty("overlapOnly", false, "Overlap Only", "phaser:Phaser.Physics.Arcade.Collider(overlapOnly)", true);
        static collideCallback = SimpleProperty("collideCallback", "", "Collide Callback", "phaser:Phaser.Physics.Arcade.Collider(collideCallback)", true);
        static processCallback = SimpleProperty("processCallback", "", "Process Callback", "phaser:Phaser.Physics.Arcade.Collider(processCallback)", true);
        static callbackContext = SimpleProperty("callbackContext", "", "Callback Context", "phaser:Phaser.Physics.Arcade.Collider(callbackContext)", true);

        constructor(obj: Collider) {
            super(obj,
                ColliderComponent.object1,
                ColliderComponent.object2,
                ColliderComponent.overlapOnly,
                ColliderComponent.collideCallback,
                ColliderComponent.processCallback,
                ColliderComponent.callbackContext
            );
        }
    }
}