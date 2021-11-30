
// You can write more code here

/* START OF COMPILED CODE */

class Level extends Phaser.Scene {

	constructor() {
		super("Level");

		/* START-USER-CTR-CODE */
		// Write your code here.
		/* END-USER-CTR-CODE */
	}

	editorCreate(): void {

		// dino
		const dino = this.add.image(400, 245.50984430371858, "dino");

		// text_1
		const text_1 = this.add.text(400, 406, "", {});
		text_1.setOrigin(0.5, 0);
		text_1.text = "Phaser 3 + Phaser Editor 2D + TypeScript";
		text_1.setStyle({ "fontFamily": "arial", "fontSize": "3em" });

		// dinoPrefab
		const dinoPrefab = new DinoPrefab(this, 186, 160);
		this.add.existing(dinoPrefab);

		// doubleDinoPrefab
		const doubleDinoPrefab = new DoubleDinoPrefab(this, 666, 35);
		this.add.existing(doubleDinoPrefab);

		// withAwakeEventPrefab
		const withAwakeEventPrefab = new WithAwakeEventPrefab(this, 415, 505);
		this.add.existing(withAwakeEventPrefab);

		// dino (components)
		const dinoPushOnClick = new PushOnClick(dino);
		dinoPushOnClick.pushScale = 0.8;
		new Tint(dino);

		// dinoPrefab (prefab fields)
		dinoPrefab.rotating = true;

		this.dino = dino;

		this.events.emit("scene-awake");
	}

	private dino: Phaser.GameObjects.Image | undefined;

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
