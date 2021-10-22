
// You can write more code here

/* START OF COMPILED CODE */

class ComponentWithoutAwake {

	constructor(gameObject: Phaser.GameObjects.Text) {
		this.gameObject = gameObject;
		(gameObject as any)["__ComponentWithoutAwake"] = this;

		/* START-USER-CTR-CODE */
		// Write your code here.
		/* END-USER-CTR-CODE */
	}

	static getComponent(gameObject: Phaser.GameObjects.Text): ComponentWithoutAwake {
		return (gameObject as any)["__ComponentWithoutAwake"];
	}

	private gameObject: Phaser.GameObjects.Text;

	/* START-USER-CODE */

	// Write your code here.

	/* END-USER-CODE */
}

/* END OF COMPILED CODE */

// You can write more code here
