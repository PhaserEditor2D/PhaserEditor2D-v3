
// You can write more code here

/* START OF COMPILED CODE */

class TextWordWrapScene extends Phaser.Scene {
	
	constructor() {
		super("TextWordWrapScene");
		
		/* START-USER-CTR-CODE */
		// Write your code here.
		/* END-USER-CTR-CODE */
	}
	
	editorCreate() {
		
		// text
		const text = this.add.text(114, 110, "", {});
		text.text = "New   long text   !";
		text.setStyle({"fontFamily":"arial","fontSize":"40px"});
		text.setWordWrapWidth(100, true);
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
