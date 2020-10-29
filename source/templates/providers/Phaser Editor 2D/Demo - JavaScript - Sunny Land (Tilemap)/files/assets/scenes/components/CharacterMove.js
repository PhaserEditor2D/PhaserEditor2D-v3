
// You can write more code here

/* START OF COMPILED CODE */

class CharacterMove extends EventComponent {
	
	constructor(gameObject) {
		super(gameObject);
		
		gameObject["__CharacterMove"] = this;
		
		/** @type {Phaser.GameObjects.Image} */
		this.gameObject = gameObject;
		/** @type {number} */
		this.deltaX = 0;
		/** @type {number} */
		this.deltaY = 0;
		/** @type {number} */
		this.duration = 0;
		
		/* START-USER-CTR-CODE */
		// Write your code here.
		/* END-USER-CTR-CODE */
	}
	
	/** @returns {CharacterMove} */
	static getComponent(gameObject) {
		return gameObject["__CharacterMove"];
	}
	
	/* START-USER-CODE */

	start() {

		this.scene.tweens.add({
			targets: this.gameObject,
			duration: this.duration,
			x: this.gameObject.x + this.deltaX,
			y: this.gameObject.y + this.deltaY,
			yoyo: true,
			repeat: -1
		});
	}

	/* END-USER-CODE */
}

/* END OF COMPILED CODE */

// You can write more code here
