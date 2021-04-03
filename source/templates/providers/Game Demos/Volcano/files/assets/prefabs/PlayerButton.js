
// You can write more code here

/* START OF COMPILED CODE */

class PlayerButton extends Phaser.GameObjects.Image {
	
	constructor(scene, x, y, texture, frame) {
		super(scene, x, y, texture || "ui", frame !== undefined && frame !== null ? frame : "btn-up");
		
		// this (components)
		new ScrollFactor(this);
		new PlayerController(this);
		
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
