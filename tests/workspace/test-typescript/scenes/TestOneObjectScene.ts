
// You can write more code here

/* START OF COMPILED CODE */

class TestOneObjectScene extends Phaser.Scene {

	constructor() {
		super("TestOneObjectScene");

		/* START-USER-CTR-CODE */
		// Write your code here.
		/* END-USER-CTR-CODE */
	}

	editorCreate(): void {

		// dino
		const dino = this.add.image(482, 178, "dino");

		this.dino = dino;

		this.events.emit("scene-awake");
	}

	public dino: Phaser.GameObjects.Image | undefined;

	/* START-USER-CODE */

	// Write your code here

	create() {

		this.editorCreate();
	}

	/* END-USER-CODE */
}

/* END OF COMPILED CODE */

// You can write more code here
