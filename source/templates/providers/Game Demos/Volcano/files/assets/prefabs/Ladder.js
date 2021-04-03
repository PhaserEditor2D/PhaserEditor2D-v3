
// You can write more code here

/* START OF COMPILED CODE */

class Ladder extends Phaser.GameObjects.Image {
	
	constructor(scene, x, y, texture, frame) {
		super(scene, x, y, texture || "volcano", frame !== undefined && frame !== null ? frame : "Volcano Level Set_Platformer - Ladder.png");
		
		this.setOrigin(0, 0);
		
		// this (components)
		const thisPlatformPhysics = new PlatformPhysics(this);
		thisPlatformPhysics.bodyY = 80;
		
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
