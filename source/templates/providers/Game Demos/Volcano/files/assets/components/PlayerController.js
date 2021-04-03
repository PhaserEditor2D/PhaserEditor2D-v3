
/* START OF COMPILED CODE */

class PlayerController extends EventComponent {
	
	constructor(gameObject) {
		super(gameObject);
		
		gameObject["__PlayerController"] = this;
		
		/** @type {Phaser.GameObjects.Image} */
		this.gameObject = gameObject;
		/** @type {Player} */
		this.player;
		/** @type {"left"|"right"|"up"} */
		this.direction = "left";
		
		/* START-USER-CTR-CODE */

		this.gameObject.setInteractive();
				
		/* END-USER-CTR-CODE */
	}
	
	/** @returns {PlayerController} */
	static getComponent(gameObject) {
		return gameObject["__PlayerController"];
	}
	
	/* START-USER-CODE */

	update() {

		const input = this.gameObject.scene.input;

		if (!input.activePointer.isDown) {
			return;
		}

		const objects = input.hitTestPointer(input.activePointer);

		if (objects.indexOf(this.gameObject) >= 0) {
			
			this.player.pressButton(this.direction);
		}		
	}

	/* END-USER-CODE */
}

/* END OF COMPILED CODE */

// You can write more code here
