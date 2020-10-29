
// You can write more code here

/* START OF COMPILED CODE */

class PhysicsBody extends EventComponent {
	
	constructor(gameObject) {
		super(gameObject);
		
		gameObject["__PhysicsBody"] = this;
		
		/** @type {Phaser.GameObjects.Image} */
		this.gameObject = gameObject;
		/** @type {number} */
		this.bodyX = 0;
		/** @type {number} */
		this.bodyY = 0;
		/** @type {number} */
		this.bodyWidth = 0;
		/** @type {number} */
		this.bodyHeight = 0;
		
		/* START-USER-CTR-CODE */
		// Write your code here.
		/* END-USER-CTR-CODE */
	}
	
	/** @returns {PhysicsBody} */
	static getComponent(gameObject) {
		return gameObject["__PhysicsBody"];
	}
	
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
