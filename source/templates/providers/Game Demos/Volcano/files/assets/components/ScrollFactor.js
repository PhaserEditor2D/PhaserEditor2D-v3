
// You can write more code here

/* START OF COMPILED CODE */

class ScrollFactor extends EventComponent {
	
	constructor(gameObject) {
		super(gameObject);
		
		gameObject["__ScrollFactor"] = this;
		
		/** @type {Phaser.GameObjects.Image} */
		this.gameObject = gameObject;
		/** @type {number} */
		this.x = 0;
		/** @type {number} */
		this.y = 0;
		
		/* START-USER-CTR-CODE */
		/* END-USER-CTR-CODE */
	}
	
	/** @returns {ScrollFactor} */
	static getComponent(gameObject) {
		return gameObject["__ScrollFactor"];
	}
	
	/* START-USER-CODE */

	start() {

		this.gameObject.setScrollFactor(this.x, this.y);
	}

	/* END-USER-CODE */
}

/* END OF COMPILED CODE */

// You can write more code here
