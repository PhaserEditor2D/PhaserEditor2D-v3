
// You can write more code here

/* START OF COMPILED CODE */

class DerivedContainer1Prefab extends BaseContainerPrefab {

	constructor(scene: Phaser.Scene, x?: number, y?: number) {
		super(scene, x ?? 95, y ?? 47);

		this.text.setPosition(220, 70);
		this.text.text = "derived prefab";
		this.text.setStyle({ "color": "#f75bb1ff", "strokeThickness":4});

		/* START-USER-CTR-CODE */
		// Write your code here.
		/* END-USER-CTR-CODE */
	}

	/* START-USER-CODE */

	// Write your code here.

	/* END-USER-CODE */
}

/* END OF COMPILED CODE */

// You can write more code here
