/* START OF COMPILED CODE */

import Phaser from "phaser";
import PushOnClick from "../comps/PushOnClick";

export default class Level extends Phaser.Scene {
	
	constructor() {
		super("Level");
		
		/* START-USER-CTR-CODE */
		// Write your code here.
		/* END-USER-CTR-CODE */
	}
	
	editorCreate() {
		
		// dino
		const dino = this.add.image(400, 225, "dino");
		
		// text
		const text = this.add.text(400, 410, "", {});
		text.setOrigin(0.5, 0.5);
		text.text = "Phaser 3 + Phaser Editor 2D + TypeScript + Parcel";
		text.setStyle({"fontFamily":"arial","fontSize":"3em"});
		
		// text_1
		const text_1 = this.add.text(400, 496, "", {});
		text_1.setOrigin(0.5, 0.5);
		text_1.text = "(a fork of the Ourcade.co templates)";
		text_1.setStyle({"fontFamily":"arial","fontSize":"2em"});
		
		// dino (components)
		new PushOnClick(dino);
		dino.emit("components-awake");
	}
	
	/* START-USER-CODE */

	// Write more code here

	create() {

		this.editorCreate();
	}

	/* END-USER-CODE */
}

/* END OF COMPILED CODE */

// You can write more code here
