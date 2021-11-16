
// You can write more code here

/* START OF COMPILED CODE */

class TextWordWrapScene extends Phaser.Scene {

	constructor() {
		super("TextWordWrapScene");

		/* START-USER-CTR-CODE */
		// Write your code here.
		/* END-USER-CTR-CODE */
	}

	editorCreate(): void {

		// text
		const text = this.add.text(114, 110, "", {});
		text.text = "New   long text   !";
		text.setStyle({ "fontFamily": "arial", "fontSize": "40px" });
		text.setWordWrapWidth(60, true);

		// text_1
		const text_1 = this.add.text(274, 142, "", {});
		text_1.text = "New text";
		text_1.setStyle({ "fontSize": "80px" });

		this.events.emit("scene-awake");
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
