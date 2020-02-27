
// You can write more code here

/* START OF COMPILED CODE */

class Fire extends BaseObject {

	constructor(scene, x, y, texture, frame) {
		super(scene, x, y, texture || "Objects", frame !== undefined && frame !== null ? frame : "Fire");

		this.angle = 90;

	}

	/* START-USER-CODE */

	preUpdate(time, delta) {

		if (this.x - this.width > 800) {

			this.active = false;
			this.visible = false;
		}
	}

	/* END-USER-CODE */
}

/* END OF COMPILED CODE */

// You can write more code here
