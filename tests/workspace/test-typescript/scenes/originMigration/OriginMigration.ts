
// You can write more code here

/* START OF COMPILED CODE */

class OriginMigration extends Phaser.Scene {

	constructor() {
		super("OriginMigration");

		/* START-USER-CTR-CODE */
		// Write your code here.
		/* END-USER-CTR-CODE */
	}

	editorCreate(): void {

		// textWithOriginPrefab
		const textWithOriginPrefab = new TextWithOriginPrefab(this, 205, 269);
		this.add.existing(textWithOriginPrefab);
		textWithOriginPrefab.setOrigin(0.5, 0.5);

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
