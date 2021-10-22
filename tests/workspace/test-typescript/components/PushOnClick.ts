/// <reference path="./UserComponent.ts"/>

// You can write more code here

/* START OF COMPILED CODE */

class PushOnClick extends UserComponent {

	constructor(gameObject: Phaser.GameObjects.Image) {
		super(gameObject);

		this.gameObject = gameObject;
		(gameObject as any)["__PushOnClick"] = this;

		/* START-USER-CTR-CODE */
		// Write your code here.
		/* END-USER-CTR-CODE */
	}

	static getComponent(gameObject: Phaser.GameObjects.Image): PushOnClick {
		return (gameObject as any)["__PushOnClick"];
	}

	private gameObject: Phaser.GameObjects.Image;
	public pushScale: number = 0.5;

	/* START-USER-CODE */

	awake() {

		this.gameObject.setInteractive().on("pointerdown", () => {

			this.scene.add.tween({
				targets: this.gameObject,
				scaleX: this.pushScale,
				scaleY: this.pushScale,
				duration: 80,
				yoyo: true
			});
		});
	}

	/* END-USER-CODE */
}

/* END OF COMPILED CODE */

// You can write more code here
