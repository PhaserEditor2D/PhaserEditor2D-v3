
// You can write more code here

/* START OF COMPILED CODE */

class FollowObject extends EventComponent {
	
	constructor(gameObject) {
		super(gameObject);
		
		gameObject["__FollowObject"] = this;
		
		/** @type {Phaser.GameObjects.Image} */
		this.gameObject = gameObject;
		/** @type {Phaser.GameObjects.Components.Transform} */
		this.target;
		
		/* START-USER-CTR-CODE */		
		/* END-USER-CTR-CODE */
	}
	
	/** @returns {FollowObject} */
	static getComponent(gameObject) {
		return gameObject["__FollowObject"];
	}
	
	/* START-USER-CODE */

	start() {		

		this.offsetX = this.gameObject.x - this.target.x;
		this.offsetY = this.gameObject.y - this.target.y;
	}

	update() {		

		this.gameObject.x = this.target.x + this.offsetX;
		this.gameObject.y = this.target.y + this.offsetY;

		if (this.gameObject.body && this.target.body) {

			this.gameObject.body.velocity.x = this.target.body.velocity.x;
			this.gameObject.body.velocity.y = this.target.body.velocity.y;
		}
	}

	/* END-USER-CODE */
}

/* END OF COMPILED CODE */

// You can write more code here
