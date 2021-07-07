
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
		text_1.setWordWrapWidth(0, false);
		
		// dino_1
		const dino_1 = new DinoPrefab(this, 186, 160);
		this.add.existing(dino_1);
		
		// container_1
		const container_1 = new DoubleDinoPrefab(this, 666, 35);
		this.add.existing(container_1);
		
		// dino (components)
		const dinoPushOnClick = new PushOnClick(dino);
		dinoPushOnClick.pushScale = 0.8;
		dino.emit("components-awake");
		
		// dino_1 (prefab fields)
		dino_1.rotating = true;
		dino_1.origin = "bottom";
		dino_1.emit("prefab-awake");
		
		// container_1 (prefab fields)
		container_1.emit("prefab-awake");
		
		this.dino = dino;
	}
	
	private dino: Phaser.GameObjects.Image|undefined;
	
	/* START-USER-CODE */

	// Write your code here.

	create() {

		this.editorCreate();
	}

	update() {

		if (this.dino) {

			this.dino.y -= 1;
		}
	}

	/* END-USER-CODE */
}

/* END OF COMPILED CODE */

// You can write more code here
