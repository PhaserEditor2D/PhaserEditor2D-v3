
// You can write more code here

/* START OF COMPILED CODE */

class TextWithOriginPrefab extends Phaser.GameObjects.Text {

	constructor(scene: Phaser.Scene, x?: number, y?: number) {
		super(scene, x ?? 407, y ?? 224, "", {});

		this.setOrigin(0.5, 0.5);
		this.text = "Text Prefab\nOrigin 0.5";
		this.setStyle({ "backgroundColor": "#7bfb6eff", "fontFamily": "serif", "fontSize": "40px", "stroke": "#000000ff", "strokeThickness":2});
		this.setLineSpacing(20);

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
