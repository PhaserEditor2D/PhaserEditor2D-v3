
// You can write more code here

/* START OF COMPILED CODE */

class Tint extends UserComponent {

	constructor(gameObject: Phaser.GameObjects.Image) {
		super(gameObject);

		this.gameObject = gameObject;
		(gameObject as any)["__Tint"] = this;

		/* START-USER-CTR-CODE */
		// Write your code here.
		/* END-USER-CTR-CODE */

		// custom definition props
		this.tint = "red";
	}

	static getComponent(gameObject: Phaser.GameObjects.Image): Tint {
		return (gameObject as any)["__Tint"];
	}

	private gameObject: Phaser.GameObjects.Image;

	/* START-USER-CODE */

	set tint(tint: "red" | "green" | "blue") {

		switch (tint) {
			case "red":
				this.gameObject.setTint(0xff0000);
				break;
			case "green":
				this.gameObject.setTint(0x00ff00);
				break;
			case "blue":
				this.gameObject.setTint(0x0000ff);
				break;
		}
	}

	/* END-USER-CODE */
}

/* END OF COMPILED CODE */

// You can write more code here
