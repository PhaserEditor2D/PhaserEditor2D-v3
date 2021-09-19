
// You can write more code here

/* START OF COMPILED CODE */

class Cherry extends Phaser.GameObjects.Sprite {

	constructor(scene, x, y, texture, frame) {
		super(scene, x ?? 76, y ?? 31, texture || "atlas", frame ?? "cherry/cherry-1");

		// this (components)
		new Physics(this);
		const thisStartAnimation = new StartAnimation(this);
		thisStartAnimation.animationKey = "cherry/cherry";

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
