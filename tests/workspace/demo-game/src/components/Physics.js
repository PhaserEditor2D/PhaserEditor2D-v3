
// You can write more code here

/* START OF COMPILED CODE */

class Physics extends UserComponent {

	constructor(gameObject) {
		super(gameObject);

		this.gameObject = gameObject;
		gameObject["__Physics"] = this;

		/* START-USER-CTR-CODE */
		// Write your code here.
		/* END-USER-CTR-CODE */
	}

	/** @returns {Physics} */
	static getComponent(gameObject) {
		return gameObject["__Physics"];
	}

	/** @type {Phaser.GameObjects.Image} */
	gameObject;
	/** @type {number} */
	bodyGravity = 0;

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
