
// You can write more code here

/* START OF COMPILED CODE */

class TestTileSpriteSizeInInspector extends Phaser.Scene {

	constructor() {
		super("TestTileSpriteSizeInInspector");

		/* START-USER-CTR-CODE */
		// Write your code here.
		/* END-USER-CTR-CODE */
	}

	editorCreate(): void {

		// dino
		this.add.tileSprite(418, 329, 756, 565, "dino");

		// rectangle_1
		const rectangle_1 = this.add.rectangle(89, 84, 128, 128);
		rectangle_1.isFilled = true;

		this.events.emit("scene-awake");
	}

	/* START-USER-CODE */

	// Write your code here

	create() {

		this.editorCreate();
	}

	/* END-USER-CODE */
}

/* END OF COMPILED CODE */

// You can write more code here
