
// You can write more code here

/* START OF COMPILED CODE */

class CharacterMove extends UserComponent {

	constructor(gameObject) {
		super(gameObject);

		this.gameObject = gameObject;
		gameObject["__CharacterMove"] = this;

		/* START-USER-CTR-CODE */
		// Write your code here.
		/* END-USER-CTR-CODE */
	}

	/** @returns {CharacterMove} */
	static getComponent(gameObject) {
		return gameObject["__CharacterMove"];
	}

	/** @type {Phaser.GameObjects.Image} */
	gameObject;
	/** @type {number} */
	deltaX = 0;
	/** @type {number} */
	deltaY = 0;
	/** @type {number} */
	duration = 0;

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
