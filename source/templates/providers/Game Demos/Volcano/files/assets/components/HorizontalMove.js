
// You can write more code here

/* START OF COMPILED CODE */

class HorizontalMove extends EventComponent {
	
	constructor(gameObject) {
		super(gameObject);
		
		gameObject["__HorizontalMove"] = this;
		
		/** @type {Phaser.GameObjects.Image} */
		this.gameObject = gameObject;
		/** @type {number} */
		this.horizVelocity = 0;
		/** @type {number} */
		this.minX = 0;
		/** @type {number} */
		this.maxX = 3070;
		
		/* START-USER-CTR-CODE */			
		/* END-USER-CTR-CODE */
	}
	
	/** @returns {HorizontalMove} */
	static getComponent(gameObject) {
		return gameObject["__HorizontalMove"];
	}
	
	/* START-USER-CODE */

	start() {

		/** @type Phaser.Physics.Arcade.Body */
		const body = this.gameObject.body;

		body.velocity.x = this.horizVelocity;
	}

	update() {

		/** @type Phaser.Physics.Arcade.Body */
		const body = this.gameObject.body;

		if (this.gameObject.x < this.minX) {

			body.velocity.x = Math.abs(this.horizVelocity);
		}

		if (this.gameObject.x > this.maxX) {

			body.velocity.x = -Math.abs(this.horizVelocity);
		}
	}

	/* END-USER-CODE */
}

/* END OF COMPILED CODE */

// You can write more code here
