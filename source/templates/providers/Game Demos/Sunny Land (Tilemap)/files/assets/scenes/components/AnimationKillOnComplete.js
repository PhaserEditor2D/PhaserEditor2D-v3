
// You can write more code here

/* START OF COMPILED CODE */

class AnimationKillOnComplete extends EventComponent {
	
	constructor(gameObject) {
		super(gameObject);
		
		gameObject["__AnimationKillOnComplete"] = this;
		
		/** @type {Phaser.GameObjects.Sprite} */
		this.gameObject = gameObject;
		/** @type {string} */
		this.animationKey = "";
		
		/* START-USER-CTR-CODE */
		// Write your code here.
		/* END-USER-CTR-CODE */
	}
	
	/** @returns {AnimationKillOnComplete} */
	static getComponent(gameObject) {
		return gameObject["__AnimationKillOnComplete"];
	}
	
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
