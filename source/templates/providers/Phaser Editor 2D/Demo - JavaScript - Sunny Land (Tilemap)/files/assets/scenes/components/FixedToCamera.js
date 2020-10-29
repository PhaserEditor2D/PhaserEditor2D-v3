
// You can write more code here

/* START OF COMPILED CODE */

class FixedToCamera extends EventComponent {
	
	constructor(gameObject) {
		super(gameObject);
		
		gameObject["__FixedToCamera"] = this;
		
		/** @type {Phaser.GameObjects.Image} */
		this.gameObject = gameObject;
		
		/* START-USER-CTR-CODE */
		// Write your code here.
		/* END-USER-CTR-CODE */
	}
	
	/** @returns {FixedToCamera} */
	static getComponent(gameObject) {
		return gameObject["__FixedToCamera"];
	}
	
	/* START-USER-CODE */

	start() {

		this.gameObject.setScrollFactor(0, 0);
	}

	/* END-USER-CODE */
}

/* END OF COMPILED CODE */

// You can write more code here
