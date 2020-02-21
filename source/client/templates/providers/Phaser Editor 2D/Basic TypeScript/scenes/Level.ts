
// You can write more code here

/* START OF COMPILED CODE */

class Level extends Phaser.Scene {
	
	constructor() {
		super("Level");
		
	}
	
	create() {
		
		// dino
		this.add.image(400, 245.50984430371858, "dino");
		
		// text_1
		const text_1 = this.add.text(400, 400, "", {});
		text_1.setOrigin(0.5, 0);
		text_1.text = "Welcome to Phaser Editor 2D!";
		text_1.setStyle({"fontSize":"24px","fontStyle":"bold"});
		
	}
	
	/* START-USER-CODE */

	// Write your code here.

	/* END-USER-CODE */
}

/* END OF COMPILED CODE */

// You can write more code here
