
// You can write more code here

/* START OF COMPILED CODE */

class Eagle extends Phaser.GameObjects.Sprite {

	constructor(scene, x, y, texture, frame) {
		super(scene, x ?? 95, y ?? 75, texture || "atlas", frame ?? "eagle/eagle-attack-1");

		// this (components)
		new Physics(this);
		const thisPhysicsBody = new PhysicsBody(this);
		thisPhysicsBody.bodyX = 16;
		thisPhysicsBody.bodyY = 13;
		thisPhysicsBody.bodyWidth = 8;
		thisPhysicsBody.bodyHeight = 20;
		const thisStartAnimation = new StartAnimation(this);
		thisStartAnimation.animationKey = "eagle/eagle-attack";

		/* START-USER-CTR-CODE */
		this.scene.tweens.add({
			targets: this,
			y: this.y + 50
		});
		/* END-USER-CTR-CODE */
	}

	/* START-USER-CODE */

	preUpdate(time, delta) {

		super.preUpdate(time, delta);

		/** @type {Level} */
		const level = this.scene;

		const player = level.player;

		this.flipX = this.x < player.x;
	}

	/* END-USER-CODE */
}

/* END OF COMPILED CODE */

// You can write more code here
