
// You can write more code here

/* START OF COMPILED CODE */

class AnotherPrefabPrefab extends Phaser.GameObjects.Container {

	constructor(scene: Phaser.Scene, x?: number, y?: number) {
		super(scene, x ?? 0, y ?? -16.506139428920388);

		// coloredBlue
		const coloredBlue = scene.add.text(0, 16.506139428920388, "", {});
		coloredBlue.setOrigin(0.5, 0.5);
		coloredBlue.text = "This is another prefab";
		coloredBlue.setStyle({ "backgroundColor": "#00ccffff", "color": "#a93005ff", "fontSize": "40px" });
		this.add(coloredBlue);

		// coloredYellow
		const coloredYellow = scene.add.text(-6, 71, "", {});
		coloredYellow.setOrigin(0.5, 0.5);
		coloredYellow.text = "This is another prefab";
		coloredYellow.setStyle({ "backgroundColor": "#f4ff00ff", "color": "#a93005ff", "fontSize": "40px" });
		this.add(coloredYellow);

		this.coloredBlue = coloredBlue;
		this.coloredYellow = coloredYellow;

		/* START-USER-CTR-CODE */
        // Write your code here.
        /* END-USER-CTR-CODE */
	}

	public coloredBlue: Phaser.GameObjects.Text;
	public coloredYellow: Phaser.GameObjects.Text;

	/* START-USER-CODE */

    // Write your code here.

    /* END-USER-CODE */
}

/* END OF COMPILED CODE */

// You can write more code here
