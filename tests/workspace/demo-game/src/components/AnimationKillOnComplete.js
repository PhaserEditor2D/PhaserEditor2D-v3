
// You can write more code here

/* START OF COMPILED CODE */

class AnimationKillOnComplete extends UserComponent {

	constructor(gameObject) {
		super(gameObject);

		this.gameObject = gameObject;
		gameObject["__AnimationKillOnComplete"] = this;

		/* START-USER-CTR-CODE */
		// Write your code here.
		/* END-USER-CTR-CODE */
	}

	/** @returns {AnimationKillOnComplete} */
	static getComponent(gameObject) {
		return gameObject["__AnimationKillOnComplete"];
	}

	/** @type {Phaser.GameObjects.Sprite} */
	gameObject;
	/** @type {string} */
	animationKey = "";

	/* START-USER-CODE */

	start() {

		this.gameObject.once(
			Phaser.Animations.Events.SPRITE_ANIMATION_KEY_COMPLETE + this.animationKey,
			() => this.gameObject.destroy()
		);
	}

	/* END-USER-CODE */
}

/* END OF COMPILED CODE */

// You can write more code here
