
// You can write more code here

/* START OF COMPILED CODE */

class DoubleDinoPrefab extends Phaser.GameObjects.Container {

	constructor(scene: Phaser.Scene, x?: number, y?: number) {
		super(scene, x ?? 0, y ?? 0);

		// dinoLeft
		const dinoLeft = new DinoPrefab(scene, 0, 0);
		this.add(dinoLeft);

		// dinoRight
		const dinoRight = new DinoPrefab(scene, 90, 166);
		this.add(dinoRight);

		// lists
		const testListInPrefab = [dinoRight, dinoLeft]

		this.dinoLeft = dinoLeft;
		this.dinoRight = dinoRight;
		this.testListInPrefab = testListInPrefab;

		/* START-USER-CTR-CODE */
		// Write your code here.
		/* END-USER-CTR-CODE */

		// custom definition props
		this.ghost = true;
	}

	private dinoLeft: DinoPrefab;
	private dinoRight: DinoPrefab;
	private testListInPrefab: DinoPrefab[];

	/* START-USER-CODE */

	set ghost(ghost: boolean) {

		this.alpha = ghost ? 0.5 : 1;
	}

	/* END-USER-CODE */
}

/* END OF COMPILED CODE */

// You can write more code here
