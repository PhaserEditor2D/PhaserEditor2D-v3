
// You can write more code here

/* START OF COMPILED CODE */

class Opossum extends Phaser.GameObjects.Sprite {

	constructor(scene, x, y, texture, frame) {
		super(scene, x ?? 157, y ?? 73, texture || "atlas", frame ?? "opossum/opossum-1");

		// this (components)
		const thisPhysics = new Physics(this);
		thisPhysics.bodyGravity = 500;
		const thisPhysicsBody = new PhysicsBody(this);
		thisPhysicsBody.bodyX = 16;
		thisPhysicsBody.bodyY = 13;
		thisPhysicsBody.bodyWidth = 8;
		thisPhysicsBody.bodyHeight = 15;
		const thisStartAnimation = new StartAnimation(this);
		thisStartAnimation.animationKey = "opossum/opossum";

		/* START-USER-CTR-CODE */

		this.scene.events.once("update", () => this.start());

		/* END-USER-CTR-CODE */
	}

	/* START-USER-CODE */

	preUpdate(time, delta) {

		super.preUpdate(time, delta);

		/** @type {Phaser.Physics.Arcade.Body} */
		const body = this.body;

		if (!body) {

			return;
		}

		this.flipX = body.velocity.x > 0;
	}

	start() {

		/** @type {Phaser.Physics.Arcade.Body} */
		const body = this.body;

		body.velocity.x = 60 * Phaser.Math.RND.pick([1, -1]);
		body.bounce.x = 1;
	}

	/* END-USER-CODE */
}

/* END OF COMPILED CODE */

// You can write more code here
