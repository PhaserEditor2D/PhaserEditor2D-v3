
// You can write more code here

/* START OF COMPILED CODE */

class PlatformPhysics extends EventComponent {
	
	constructor(gameObject) {
		super(gameObject);
		
		gameObject["__PlatformPhysics"] = this;
		
		/** @type {Phaser.GameObjects.Image} */
		this.gameObject = gameObject;
		/** @type {number} */
		this.bodyY = 8;
		
		/* START-USER-CTR-CODE */

		this.gameObject.scene.physics.add.existing(this.gameObject);

		/** @type Phaser.Physics.Arcade.Body */
		const body = this.gameObject.body;
		body.velocity.set(0, 0);
		body.immovable = true;

		body.checkCollision.up = true;
		body.checkCollision.down = false;
		body.checkCollision.left = false;
		body.checkCollision.right = false;
		
		/* END-USER-CTR-CODE */
	}
	
	/** @returns {PlatformPhysics} */
	static getComponent(gameObject) {
		return gameObject["__PlatformPhysics"];
	}
	
	/* START-USER-CODE */

	update() {

		/** @type Phaser.Physics.Arcade.Body */
		const body = this.gameObject.body;

		body.offset.y = this.bodyY;

		body.offset.set(0, this.bodyY);

		if (this.gameObject instanceof Phaser.GameObjects.Container) {

			const list = this.gameObject.list;

			let width = 0;

			for (const obj of list) {

				width += obj.width;
			}

			body.setSize(width, 1);
		}
	}

	/* END-USER-CODE */
}

/* END OF COMPILED CODE */

// You can write more code here
