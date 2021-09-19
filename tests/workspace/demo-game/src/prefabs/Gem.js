
// You can write more code here

/* START OF COMPILED CODE */

class Gem extends Phaser.GameObjects.Sprite {

	constructor(scene, x, y, texture, frame) {
		super(scene, x ?? 127, y ?? 45, texture || "atlas", frame ?? "gem/gem-1");

		// this (components)
		new Physics(this);
		const thisStartAnimation = new StartAnimation(this);
		thisStartAnimation.animationKey = "gem/gem";

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
