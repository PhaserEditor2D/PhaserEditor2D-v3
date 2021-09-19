
// You can write more code here

/* START OF COMPILED CODE */

class FeedbackItem extends Phaser.GameObjects.Sprite {

	constructor(scene, x, y, texture, frame) {
		super(scene, x ?? 154, y ?? 80, texture || "atlas", frame ?? "item-feedback/item-feedback-1");

		// this (components)
		const thisStartAnimation = new StartAnimation(this);
		thisStartAnimation.animationKey = "item-feedback/item-feedback";
		const thisAnimationKillOnComplete = new AnimationKillOnComplete(this);
		thisAnimationKillOnComplete.animationKey = "item-feedback/item-feedback";

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
