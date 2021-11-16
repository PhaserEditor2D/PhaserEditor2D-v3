
// You can write more code here

/* START OF COMPILED CODE */

class TestComponentsAwakeEvent extends Phaser.Scene {

	constructor() {
		super("TestComponentsAwakeEvent");

		/* START-USER-CTR-CODE */
		// Write your code here.
		/* END-USER-CTR-CODE */
	}

	editorCreate(): void {

		// hasComponentsAwake
		const hasComponentsAwake = this.add.text(126, 183, "", {});
		hasComponentsAwake.text = "Has components-awake";
		hasComponentsAwake.setStyle({ "fontSize": "40px" });

		// doesntHaveComponentsAwake
		const doesntHaveComponentsAwake = this.add.text(130, 275, "", {});
		doesntHaveComponentsAwake.text = "Doesn't have components-awake";
		doesntHaveComponentsAwake.setStyle({ "fontSize": "40px" });

		// dinoPrefab
		const dinoPrefab = new DinoPrefab(this, 370, 475);
		this.add.existing(dinoPrefab);

		// hasComponentsAwake (components)
		new ComponentWithAwake(hasComponentsAwake);

		// doesntHaveComponentsAwake (components)
		new ComponentWithoutAwake(doesntHaveComponentsAwake);

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
