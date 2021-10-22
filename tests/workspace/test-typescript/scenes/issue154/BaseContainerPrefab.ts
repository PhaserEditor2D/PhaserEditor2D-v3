
// You can write more code here

/* START OF COMPILED CODE */

class BaseContainerPrefab extends Phaser.GameObjects.Container {

	constructor(scene: Phaser.Scene, x?: number, y?: number) {
		super(scene, x ?? 0, y ?? 0);

		// text
		const text = scene.add.text(0, 0, "", {});
		text.text = "base container prefab";
		text.setStyle({"fontSize":"40px"});
		this.add(text);

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
