
// You can write more code here

/* START OF COMPILED CODE */

class DinoPrefab extends Phaser.GameObjects.Image {
	
	constructor(scene: Phaser.Scene, x: number, y: number, texture?: string, frame?: number | string) {
		super(scene, x, y, texture || "dino", frame);
		
		this.origin = "center";
		
		/* START-USER-CTR-CODE */

		this.once("prefab-awake", () => {

			if (this.rotating) {

				this.scene.events.on("update", () => {

					this.angle += 1;
				});
			}
		});

		/* END-USER-CTR-CODE */
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
