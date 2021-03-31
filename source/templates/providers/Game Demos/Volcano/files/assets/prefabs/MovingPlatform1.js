
// You can write more code here

/* START OF COMPILED CODE */

class MovingPlatform1 extends Phaser.GameObjects.Container {
	
	constructor(scene, x, y) {
		super(scene, x, y);
		
		// p2
		const p2 = scene.add.image(0, 0, "volcano", "Volcano Level Set_Platformer - Ground 10.png");
		p2.setOrigin(0, 0);
		this.add(p2);
		
		// p1
		const p1 = scene.add.image(128, 0, "volcano", "Volcano Level Set_Platformer - Ground 12.png");
		p1.setOrigin(0, 0);
		this.add(p1);
		
		// this (components)
		new PlatformPhysics(this);
		const thisHorizontalMove = new HorizontalMove(this);
		thisHorizontalMove.horizVelocity = 50;
		
		/* START-USER-CTR-CODE */
		// Write your code here.
		/* END-USER-CTR-CODE */
	}
	
	/* START-USER-CODE */

	// Write your code here.

	/* END-USER-CODE */
}

/* END OF COMPILED CODE */

// You can write more code here
