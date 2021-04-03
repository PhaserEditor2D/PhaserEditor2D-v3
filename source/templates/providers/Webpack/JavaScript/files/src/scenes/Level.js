
// You can write more code here

/* START OF COMPILED CODE */

import Phaser from "phaser";
import PushOnClick from "../components/PushOnClick";

export default class Level extends Phaser.Scene {
	
	constructor() {
		super("Level");
		
		/* START-USER-CTR-CODE */
		// Write your code here.
		/* END-USER-CTR-CODE */
	}
	
	editorCreate() {
		
		// text
		const text = this.add.text(400, 436, "", {});
		text.setOrigin(0.5, 0.5);
		text.text = "Phaser 3 + Phaser Editor 2D + Webpack";
		text.setStyle({"align":"center","fontFamily":"Arial","fontSize":"3em"});
		
		// fufuSuperDino
		const fufuSuperDino = this.add.image(400, 240, "FufuSuperDino");
		
		// fufuSuperDino (components)
		new PushOnClick(fufuSuperDino);
		fufuSuperDino.emit("components-awake");
	}
	
	/* START-USER-CODE */
	
	// Write your code here
	
	create() {
	
		this.editorCreate();
	}
	
	/* END-USER-CODE */
}

/* END OF COMPILED CODE */

// You can write more code here
