
// You can write more code here

/* START OF COMPILED CODE */

class Issue147 extends Phaser.Scene {

	constructor() {
		super("Issue147");

		/* START-USER-CTR-CODE */
		// Write your code here.
		/* END-USER-CTR-CODE */
	}

	editorCreate(): void {

		// dino
		const dino = this.add.image(392, 213, "dino");

		// dino_1
		const dino_1 = this.add.image(620, 202, "dino");

		// lists
		const dinoList = [dino, dino_1];

		this.dinoList = dinoList;

		this.events.emit("scene-awake");
	}

	private dinoList: Phaser.GameObjects.Image[] | undefined;

	/* START-USER-CODE */

	// Write your code here

	create() {

		this.editorCreate();
	}

	/* END-USER-CODE */
}

/* END OF COMPILED CODE */

// You can write more code here
