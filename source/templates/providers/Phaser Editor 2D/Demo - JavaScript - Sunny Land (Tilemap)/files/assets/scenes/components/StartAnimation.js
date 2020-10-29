
// You can write more code here

/* START OF COMPILED CODE */

class StartAnimation extends EventComponent {
	
	constructor(gameObject) {
		super(gameObject);
		
		gameObject["__StartAnimation"] = this;
		
		/** @type {Phaser.GameObjects.Sprite} */
		this.gameObject = gameObject;
		/** @type {string} */
		this.animationKey = "";
		
		/* START-USER-CTR-CODE */
		// Write your code here.
		/* END-USER-CTR-CODE */
	}
	
	/** @returns {StartAnimation} */
	static getComponent(gameObject) {
		return gameObject["__StartAnimation"];
	}
	
	/* START-USER-CODE */

	start() {

		this.gameObject.play(this.animationKey);
	}

	/* END-USER-CODE */
}

/* END OF COMPILED CODE */

// You can write more code here
