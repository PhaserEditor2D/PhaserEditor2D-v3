
// You can write more code here

/* START OF COMPILED CODE */

class StartAnimation extends UserComponent {

	constructor(gameObject) {
		super(gameObject);

		this.gameObject = gameObject;
		gameObject["__StartAnimation"] = this;

		/* START-USER-CTR-CODE */
		// Write your code here.
		/* END-USER-CTR-CODE */
	}

	/** @returns {StartAnimation} */
	static getComponent(gameObject) {
		return gameObject["__StartAnimation"];
	}

	/** @type {Phaser.GameObjects.Sprite} */
	gameObject;
	/** @type {string} */
	animationKey = "";

	/* START-USER-CODE */

	start() {

		this.gameObject.play(this.animationKey);
	}

	/* END-USER-CODE */
}

/* END OF COMPILED CODE */

// You can write more code here
