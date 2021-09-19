
// You can write more code here

/* START OF COMPILED CODE */

class EnemyDeath extends Phaser.GameObjects.Sprite {

	constructor(scene, x, y, texture, frame) {
		super(scene, x ?? 130, y ?? 64, texture || "atlas", frame ?? "enemy-death/enemy-death-4");

		// this (components)
		const thisStartAnimation = new StartAnimation(this);
		thisStartAnimation.animationKey = "enemy-death/enemy-death";
		const thisAnimationKillOnComplete = new AnimationKillOnComplete(this);
		thisAnimationKillOnComplete.animationKey = "enemy-death/enemy-death";

		/* START-USER-CTR-CODE */
		// Write your code here.
		/* END-USER-CTR-CODE */
	}

	/* START-USER-CODE */

	// Write your code here.

	/* END-USER-CODE */
}

/* END OF COMPILED CODE */

// You can write more code here
