
// You can write more code here

/* START OF COMPILED CODE */

class PrefabAwakeTest extends Phaser.Scene {

	constructor() {
		super("PrefabAwakeTest");

		/* START-USER-CTR-CODE */
		// Write your code here.
		/* END-USER-CTR-CODE */
	}

	editorCreate(): void {

		// withoutAwakeEventPrefab
		const withoutAwakeEventPrefab = new WithoutAwakeEventPrefab(this, 59, 79);
		this.add.existing(withoutAwakeEventPrefab);

		// withAwakeEventPrefab
		const withAwakeEventPrefab = new WithAwakeEventPrefab(this, 99, 197);
		this.add.existing(withAwakeEventPrefab);

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
