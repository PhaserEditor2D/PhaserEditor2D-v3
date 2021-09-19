
// You can write more code here

/* START OF COMPILED CODE */

class PhysicsBody extends UserComponent {

	constructor(gameObject) {
		super(gameObject);

		this.gameObject = gameObject;
		gameObject["__PhysicsBody"] = this;

		/* START-USER-CTR-CODE */
		// Write your code here.
		/* END-USER-CTR-CODE */
	}

	/** @returns {PhysicsBody} */
	static getComponent(gameObject) {
		return gameObject["__PhysicsBody"];
	}

	/** @type {Phaser.GameObjects.Image} */
	gameObject;
	/** @type {number} */
	bodyX = 0;
	/** @type {number} */
	bodyY = 0;
	/** @type {number} */
	bodyWidth = 0;
	/** @type {number} */
	bodyHeight = 0;

	/* START-USER-CODE */

	start() {


		/** @type {Phaser.Physics.Arcade.Body} */
		const body = this.gameObject.body;

		body.setOffset(this.bodyX, this.bodyY);
		body.setSize(this.bodyWidth, this.bodyHeight, false);		
	}

	/* END-USER-CODE */
}

/* END OF COMPILED CODE */

// You can write more code here
