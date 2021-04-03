
// You can write more code here

/* START OF COMPILED CODE */

class MovingPlatform2 extends Phaser.GameObjects.Container {
	
	constructor(scene, x, y) {
		super(scene, x, y);
		
		// p3
		const p3 = scene.add.image(0, 0, "volcano", "Volcano Level Set_Platformer - Wooden Bridge.png");
		p3.setOrigin(0, 0);
		this.add(p3);
		
		// p2
		const p2 = scene.add.image(128, 0, "volcano", "Volcano Level Set_Platformer - Wooden Bridge.png");
		p2.setOrigin(0, 0);
		this.add(p2);
		
		// p1
		const p1 = scene.add.image(256, 0, "volcano", "Volcano Level Set_Platformer - Wooden Bridge.png");
		p1.setOrigin(0, 0);
		this.add(p1);
		
		// this (components)
		new PlatformPhysics(this);
		const thisHorizontalMove = new HorizontalMove(this);
		thisHorizontalMove.horizVelocity = 100;
		
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
