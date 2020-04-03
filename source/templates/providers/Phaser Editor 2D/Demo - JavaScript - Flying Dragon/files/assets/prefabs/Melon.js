
// You can write more code here

/* START OF COMPILED CODE */

class Melon extends BaseObject {
	
	constructor(scene, x, y, texture, frame) {
		super(scene, x, y, texture || "Objects", frame !== undefined && frame !== null ? frame : "watermelon-1");
		
		
		this._create();
		
	}
	
	/* START-USER-CODE */

	_create() {

		this.burning = false;
	}

	playDefaultAnimation() {
		
		this.anims.play("Objects - watermelon");
	}

	/* END-USER-CODE */
}

/* END OF COMPILED CODE */

// You can write more code here
