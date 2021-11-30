
// You can write more code here

/* START OF COMPILED CODE */

class BaseContainerPrefab extends Phaser.GameObjects.Container {

	constructor(scene: Phaser.Scene, x?: number, y?: number) {
		super(scene, x ?? 42, y ?? 47);

		// rectangle
		const rectangle = scene.add.rectangle(0, 0, 575, 128);
		rectangle.setOrigin(0, 0);
		rectangle.isFilled = true;
		rectangle.fillColor = 10214835;
		this.add(rectangle);

		// text
		const text = scene.add.text(38, 40, "", {});
		text.text = "base container prefab";
		text.setStyle({ "color": "#fae1afff", "fontSize": "40px", "fontStyle": "bold" });
		this.add(text);

		this.rectangle = rectangle;
		this.text = text;

		/* START-USER-CTR-CODE */
		// Write your code here.
		/* END-USER-CTR-CODE */
	}

	public rectangle: Phaser.GameObjects.Rectangle;
	public text: Phaser.GameObjects.Text;

	/* START-USER-CODE */

	// Write your code here.

	/* END-USER-CODE */
}

/* END OF COMPILED CODE */

// You can write more code here
