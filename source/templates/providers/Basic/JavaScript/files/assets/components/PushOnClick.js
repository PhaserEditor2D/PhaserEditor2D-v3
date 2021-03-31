
// You can write more code here

/* START OF COMPILED CODE */

class PushOnClick extends UserComponent {
	
	constructor(gameObject) {
		super(gameObject);
		
		this.gameObject = gameObject;
		gameObject["__PushOnClick"] = this;
		
		/* START-USER-CTR-CODE */
		// Write your code here.
		/* END-USER-CTR-CODE */
	}
	
	/** @returns {PushOnClick} */
	static getComponent(gameObject) {
		return gameObject["__PushOnClick"];
	}
	
	/** @type {Phaser.GameObjects.Image} */
	gameObject;
	
	/* START-USER-CODE */

	awake() {

		this.gameObject.setInteractive().on("pointerdown", () => {

			this.scene.add.tween({
				targets: this.gameObject,
				scaleX: "*=0.8",
				scaleY: "*=0.8",
				duration: 80,
				yoyo: true
			});
		});
	}

	/* END-USER-CODE */
}

/* END OF COMPILED CODE */

// You can write more code here
