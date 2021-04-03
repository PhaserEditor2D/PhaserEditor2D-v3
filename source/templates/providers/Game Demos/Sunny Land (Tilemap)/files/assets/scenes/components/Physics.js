
// You can write more code here

/* START OF COMPILED CODE */

class Physics extends EventComponent {
	
	constructor(gameObject) {
		super(gameObject);
		
		gameObject["__Physics"] = this;
		
		/** @type {Phaser.GameObjects.Image} */
		this.gameObject = gameObject;
		/** @type {number} */
		this.bodyGravity = 0;
		
		/* START-USER-CTR-CODE */
		// Write your code here.
		/* END-USER-CTR-CODE */
	}
	
	/** @returns {Physics} */
	static getComponent(gameObject) {
		return gameObject["__Physics"];
	}
	
	/* START-USER-CODE */

	start() {

		this.gameObject.scene.physics.add.existing(this.gameObject);

		/** @type {Phaser.Physics.Arcade.Body} */
		const body = this.gameObject.body;
		body.setGravityY(this.bodyGravity);
	}

	/* END-USER-CODE */
}

/* END OF COMPILED CODE */

// You can write more code here
