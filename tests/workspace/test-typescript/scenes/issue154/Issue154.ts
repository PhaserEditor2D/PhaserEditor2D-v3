
// You can write more code here

/* START OF COMPILED CODE */

class Issue154 extends Phaser.Scene {

	constructor() {
		super("Issue154");

		/* START-USER-CTR-CODE */
		// Write your code here.
		/* END-USER-CTR-CODE */
	}

	editorCreate(): void {

		// derivedContainer1Prefab
		const derivedContainer1Prefab = new DerivedContainer1Prefab(this, 134, 96);
		this.add.existing(derivedContainer1Prefab);

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
