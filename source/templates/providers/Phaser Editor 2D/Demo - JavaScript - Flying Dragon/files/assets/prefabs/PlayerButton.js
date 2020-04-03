
// You can write more code here

/* START OF COMPILED CODE */

class PlayerButton extends Phaser.GameObjects.Image {

	constructor(scene, x, y, texture, frame) {
		super(scene, x, y, texture || "Objects", frame !== undefined && frame !== null ? frame : "Button Flame");

		this.scaleX = 0.4;
		this.scaleY = 0.4;

		this._create();

	}

	/* START-USER-CODE */

	_create() {

		this.setInteractive();

		this.on("pointerdown", () => {

			this.setScale(0.35);

			if (this._actionCallback) {

				this._actionCallback();
			}
		});

		this.on("pointerup", () => {

			this.setScale(0.4);			
		});

		this.scene.input.on
	}

	setActionCallback(callback) {

		this._actionCallback = callback;
	}

	/* END-USER-CODE */
}

/* END OF COMPILED CODE */

// You can write more code here
