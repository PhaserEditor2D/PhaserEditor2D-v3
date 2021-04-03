
// You can write more code here

/* START OF COMPILED CODE */

class Player extends Phaser.GameObjects.Sprite {
	
	constructor(scene, x, y, texture, frame) {
		super(scene, x, y, texture || "player", frame !== undefined && frame !== null ? frame : "Idle_001");
		
		this.setOrigin(0.5045282703122486, 0.8054902070420497);
		
		/** @type {Phaser.GameObjects.GameObject[]} */
		this.platforms = [];
		/** @type {FoodItem[]} */
		this.foodItems = [];
		
		/* START-USER-CTR-CODE */

		this.scene.events.once(Phaser.Scenes.Events.UPDATE, this.start, this);
		this.scene.events.on(Phaser.Scenes.Events.UPDATE, this.updatePlayer, this);

		/* END-USER-CTR-CODE */
	}
	
	/* START-USER-CODE */

	start() {

		// physics

		/** @type Phaser.Physics.Arcade.ArcadePhysics */
		const arcade = this.scene.physics;

		arcade.add.existing(this);

		/** @type Phaser.Physics.Arcade.Body */
		const body = this.body;

		body.setSize(80, 145);
		body.setDrag(1, 0);
		body.gravity.set(0, 600);
		body.setBounce(0.2, 0.2);

		arcade.add.collider(this, this.platforms);
		arcade.add.overlap(this, this.foodItems, this.playerVsFood, null, this);

		// animation

		this.play("player-Idle");

		// controller

		this.leftKey = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
		this.rightKey = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
		this.upKey = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP);
		this.spaceKey = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

		this.jumpsCount = 0;

		this.lastWalkTime = 0;

		this.isFlying = true;

		// sound

		this.stopSound = this.scene.sound.add("fall-stop");
		this.walkingSound = this.scene.sound.add("walk");
		this.jumpSound = this.scene.sound.add("jump");
		this.flySound = this.scene.sound.add("fly");
		this.eatSound = this.scene.sound.add("eat");
	}

	/**
	 * @param {Player} player
	 * @param {FoodItem} foodItem
	 */
	playerVsFood(player, foodItem) {

		foodItem.taken();	
		this.eatSound.play();	
	}

	updatePlayer(time, delta) {		

		this.leftDown = this.leftDown || this.leftKey.isDown;
		this.rightDown = this.rightDown || this.rightKey.isDown;
		this.upDown = this.upDown || this.upKey.isDown || this.spaceKey.isDown;

		/** @type Phaser.Physics.Arcade.Body */
		const body = this.body;

		const xVelocity = 200;

		const touchingDown = body.touching.down;

		if (this.isFlying && touchingDown) {

			if (!this.stopSound.isPlaying) {

				this.stopSound.play();
			}
		}

		this.isFlying = !touchingDown;

		if (touchingDown) {

			this.jumpsCount = 0;

			if (time - this.lastWalkTime > 400) {

				body.velocity.x = 0;
			}

		}

		if (this.leftDown) {

			body.velocity.x = -xVelocity;

			if (touchingDown) {
				
				this.lastWalkTime = time;

				if (!this.walkingSound.isPlaying) {

					this.walkingSound.play();
				}
			}

			this.flipX = true;
		}

		if (this.rightDown) {

			body.velocity.x = xVelocity;

			if (touchingDown) {
				
				this.lastWalkTime = time;

				if (!this.walkingSound.isPlaying) {

					this.walkingSound.play();
				}
			}

			this.flipX = false;
		}


		if (this.upDown) {

			if (touchingDown || body.velocity.y > 0) {

				if (this.jumpsCount < 2) {

					this.jumpsCount++;
					body.velocity.y = -420;

					this.jumpSound.play();

					if (!touchingDown) {

						this.flySound.play();
					}

					this.walkingSound.stop();
				}
			}
		}

		if (body.touching.down) {

			if (body.velocity.x === 0) {

				this.play("player-Idle", true);

			} else {

				this.play("player-Running", true);
			}
		} else {

			const current = this.anims.currentAnim;

			if (current.key === "player-Jump Start") {

				if (!this.anims.isPlaying) {

					this.play("player-Jump Loop", true);
				}
			} else {

				if (current.key !== "player-Jump Loop") {

					this.play("player-Jump Start", true);
				}
			}
		}

		this.leftDown = this.rightDown = this.upDown = false;

		// check bounds

		const bounds = this.scene.cameras.main.getBounds();

		if (this.x < bounds.x) {

			this.x = 0;
		}

		if (this.x > bounds.x + bounds.width) {

			this.x = bounds.x + bounds.width;
		}

		if (this.y < bounds.y) {

			this.y = bounds.y;
		}

		if (this.y > bounds.y + bounds.height + 200) {

			this.scene.sound.play("dead");
			this.setPosition(130, 360);
		}
	}

	/** @param {"left"|"right"|"up"} direction */
	pressButton(direction) {

		switch (direction) {
			case "left":
				this.leftDown = true;
				break;
			case "right":
				this.rightDown = true;
				break;
			case "up":
				this.upDown = true;
				break;
		}
	}

	/* END-USER-CODE */
}

/* END OF COMPILED CODE */

// You can write more code here
