
// You can write more code here

/* START OF COMPILED CODE */

class Bomb extends BaseObject {
	
	constructor(scene, x, y, texture, frame) {
		super(scene, x, y, texture || "Objects", frame !== undefined && frame !== null ? frame : "bomb-1");
		
		this.setOrigin(0.5, 1);
		
	}
	
	/* START-USER-CODE */

	playDefaultAnimation() {
		
		this.anims.play("Objects - bomb");
	}

	/* END-USER-CODE */
}

/* END OF COMPILED CODE */

// You can write more code here
