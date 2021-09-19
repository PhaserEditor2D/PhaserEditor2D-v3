
// You can write more code here

/* START OF COMPILED CODE */

class Frog extends Phaser.GameObjects.Sprite {

	constructor(scene, x, y, texture, frame) {
		super(scene, x ?? 91, y ?? 51, texture || "atlas", frame ?? "frog/idle/frog-idle-1");

		// this (components)
		const thisPhysics = new Physics(this);
		thisPhysics.bodyGravity = 500;
		const thisPhysicsBody = new PhysicsBody(this);
		thisPhysicsBody.bodyX = 16;
		thisPhysicsBody.bodyY = 16;
		thisPhysicsBody.bodyWidth = 8;
		thisPhysicsBody.bodyHeight = 11;
		const thisStartAnimation = new StartAnimation(this);
		thisStartAnimation.animationKey = "frog/idle/frog-idle";

		/* START-USER-CTR-CODE */

		this.jumpEvent = this.scene.time.addEvent({
			loop: true,
			delay: 2000,
			callback: () => this.jumpFrog()
		});

		/* END-USER-CTR-CODE */
	}

	/* START-USER-CODE */

	destroy(fromScene) {

		this.jumpEvent.destroy();

		super.destroy(fromScene)
	}

	/** @return {Phaser.Physics.Arcade.Body} */
	getBody() {

		return this.body;
	}

	jumpFrog() {

		const body = this.getBody();

		this.flipX = !this.flipX;
		body.velocity.y = -200;
		body.velocity.x = this.flipX ? 50 : -50;
	}

	preUpdate(time, delta) {

		super.preUpdate(time, delta);

		// animations

		const body = this.getBody();

		if (!body) {

			return;
		}

		if (body.velocity.y < 0) {

			this.play("frog/frog-jump", true);

		} else if (body.velocity.y > 0) {

			this.play("frog/frog-fall", true);

		} else {

			this.play("frog/idle/frog-idle", true);

			body.velocity.x = 0;
		}
	}

	/* END-USER-CODE */
}

/* END OF COMPILED CODE */

// You can write more code here
