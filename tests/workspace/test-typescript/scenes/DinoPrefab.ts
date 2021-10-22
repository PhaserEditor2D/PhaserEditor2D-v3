
// You can write more code here

/* START OF COMPILED CODE */

class DinoPrefab extends Phaser.GameObjects.Image {

	constructor(scene: Phaser.Scene, x?: number, y?: number, texture?: string, frame?: number | string) {
		super(scene, x ?? 408, y ?? 207, texture || "dino", frame);

		// this (components)
		new Tint(this);
		new PushOnClick(this);

		/* START-USER-CTR-CODE */
		// Write your code here.
		/* END-USER-CTR-CODE */

		// custom definition props
		this.origin = "top";
	}

	public rotating: boolean = false;

	/* START-USER-CODE */

	set origin(origin: "top" | "center" | "bottom") {

		switch (origin) {
			case "top":

				this.setOrigin(0.5, 0);
				break;

			case "center":

				this.setOrigin(0.5, 0.5);
				break;

			case "bottom":
				this.setOrigin(0.5, 1);
				break;
		}
	}

	/* END-USER-CODE */
}

/* END OF COMPILED CODE */

// You can write more code here
