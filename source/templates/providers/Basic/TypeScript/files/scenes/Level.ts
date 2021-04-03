
// You can write more code here

/* START OF COMPILED CODE */

class Level extends Phaser.Scene {
	
	constructor() {
		super("Level");
		
		/* START-USER-CTR-CODE */
		// Write your code here.
		/* END-USER-CTR-CODE */
	}
	
	editorCreate() {
		
		// dino
		const dino = this.add.image(400, 245.50984430371858, "dino");
		
		// text_1
		const text_1 = this.add.text(400, 406, "", {});
		text_1.setOrigin(0.5, 0);
		text_1.text = "Phaser 3 + Phaser Editor 2D + TypeScript";
		text_1.setStyle({"fontFamily":"arial","fontSize":"3em"});
		
		// dino (components)
		new PushOnClick(dino);
		dino.emit("components-awake");
	}
	
	/* START-USER-CODE */

	// Write your code here.

	create() {

		this.editorCreate();
	}

	/* END-USER-CODE */
}

/* END OF COMPILED CODE */

// You can write more code here
