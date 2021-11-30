
// You can write more code here

/* START OF COMPILED CODE */

class NestedInsideContainerPrefabInstanceScene extends Phaser.Scene {

	constructor() {
		super("NestedInsideContainerPrefabInstanceScene");

		/* START-USER-CTR-CODE */
		// Write your code here.
		/* END-USER-CTR-CODE */
	}

	editorCreate(): void {

		// obj1
		const obj1 = new NestedPrefabInContainerPrefab(this, 66, 107);
		this.add.existing(obj1);
		obj1.multicolor.coloredBlue.setStyle({ "backgroundColor": "#001dffff", "color": "#f7f5f4ff" });
		obj1.nestedTextInsideContainer.text = "nested text inside container (updated)";

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
