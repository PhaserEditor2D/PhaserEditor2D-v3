/// <reference path="../PlainObjectComponent.ts" />
namespace phasereditor2d.scene.ui.sceneobjects {

    export class ColliderComponent extends PlainObjectComponent<Collider> {

        static object1 = SimpleProperty("object1", "", "Object 1", "phaser:Phaser.Physics.Arcade.Collider", true);
        static object2 = SimpleProperty("object2", "", "Object 2", "phaser:Phaser.Physics.Arcade.Collider", true);
        static onlyOverlap = SimpleProperty("onlyOverlap", false, "Only Overlap", "phaser:Phaser.Physics.Arcade.Collider", true);

        constructor(obj: Collider) {
            super(obj,
                ColliderComponent.object1,
                ColliderComponent.object2,
                ColliderComponent.onlyOverlap,
            );
        }
    }
}