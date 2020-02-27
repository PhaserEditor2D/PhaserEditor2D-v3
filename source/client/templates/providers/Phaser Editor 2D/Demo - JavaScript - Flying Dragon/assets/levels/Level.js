
// You can write more code here

/* START OF COMPILED CODE */

class Level extends Phaser.Scene {
	
	constructor() {
		super("Level");
		
	}
	
	_create() {
		
		// sky
		const sky = this.add.image(0, 0, "sky");
		sky.setOrigin(0, 0);
		
		// clouds_3
		const clouds_3 = this.add.image(100, 340, "clouds_3");
		clouds_3.setOrigin(0, 0.5);
		
		// rocks_2
		const rocks_2 = this.add.image(0, 60, "rocks_2");
		rocks_2.setOrigin(0, 0);
		
		// pines
		const pines = this.add.image(0, 0, "pines");
		pines.setOrigin(0, 0);
		
		// clouds_2
		const clouds_2 = this.add.image(0, 0, "clouds_2");
		clouds_2.setOrigin(0, 0);
		
		// dragon
		const dragon = new Dragon(this, 151, 116);
		this.add.existing(dragon);
		
		// melon
		const melon = new Melon(this, 80, 600);
		this.add.existing(melon);
		
		// melon_1
		const melon_1 = new Melon(this, 160, 600);
		this.add.existing(melon_1);
		
		// melon_2
		const melon_2 = new Melon(this, 240, 600);
		this.add.existing(melon_2);
		
		// bomb
		const bomb = new Bomb(this, 444, 600);
		this.add.existing(bomb);
		
		// bomb_1
		const bomb_1 = new Bomb(this, 545, 600);
		this.add.existing(bomb_1);
		
		// bomb_2
		const bomb_2 = new Bomb(this, 640, 600);
		this.add.existing(bomb_2);
		
		// fire
		const fire = new Fire(this, 800, 600);
		this.add.existing(fire);
		
		// fire_1
		const fire_1 = new Fire(this, 880, 600);
		this.add.existing(fire_1);
		
		// fire_2
		const fire_2 = new Fire(this, 960, 600);
		this.add.existing(fire_2);
		
		// flameButton
		const flameButton = new PlayerButton(this, 80, 380);
		this.add.existing(flameButton);
		
		// upButton
		const upButton = new PlayerButton(this, 640, 380, "Objects", "Button Up");
		this.add.existing(upButton);
		
		// downButton
		const downButton = new PlayerButton(this, 730, 380, "Objects", "Button Down");
		this.add.existing(downButton);
		
		// fields
		this.dragon = dragon;
		this.flameButton = flameButton;
		this.upButton = upButton;
		this.downButton = downButton;
		this.parallax = [pines, clouds_2, rocks_2, clouds_3];
		this.flames = [fire_2, fire_1, fire];
		this.bombs = [bomb, bomb_1, bomb_2];
		this.melons = [melon, melon_1, melon_2];
		
	}
	
	// private dragon: Dragon
	
	// private flameButton: PlayerButton
	
	// private upButton: PlayerButton
	
	// private downButton: PlayerButton
	
	// private parallax: any[]
	
	// private flames: any[]
	
	// private bombs: any[]
	
	// private melons: any[]
	
	/* START-USER-CODE */

	create() {

		this._create();

		this.physics.add.overlap(this.flames, this.melons, this.flameVsMelon, this.objectIsNotHitted, this);
		this.physics.add.overlap(this.flames, this.bombs, this.flameVsBomb, this.objectIsNotHitted, this);

		this.requestNewObject();

		this.initInput();
	}

	initInput() {

		this.input.keyboard.on("keydown_SPACE", () => this.flameButtonClicked());
		this.input.keyboard.on("keydown_UP", () => this.upButtonClicked());
		this.input.keyboard.on("keydown_DOWN", () => this.downButtonClicked());

		this.flameButton.setActionCallback(()=> this.flameButtonClicked());
		this.upButton.setActionCallback(()=> this.upButtonClicked());
		this.downButton.setActionCallback(()=> this.downButtonClicked());
	}

	flameButtonClicked() {

		var flame = this.flames.find(obj => !obj.active)

		if (!flame) {
			return;
		}

		flame.x = this.dragon.x + this.dragon.width - this.dragon.displayOriginX;
		flame.y = this.dragon.y;
		flame.active = true;
		flame.visible = true;
		flame.body.enable = true;
		flame.body.velocity.x = 500;
		flame.body.velocity.y = 0;

		if (this._lastFireUp) {

			flame.body.gravity.y = 400;

			this._lastFireUp = false;

		} else {

			flame.body.gravity.y = -800;

			this._lastFireUp = true;
		}

		this.dragon.anims.play("dragon - dragon/Flaming", true);
	}

	upButtonClicked() {

		this.moveDragon(-200);
	}

	downButtonClicked() {

		this.moveDragon(200);
	}

	moveDragon(velocityY) {

		this.dragon.body.velocity.y = velocityY;
	}

	/**
	 * 
	 * @param {Fire} flame 
	 * @param {BaseObject} obj 
	 */
	objectIsNotHitted(flame, obj) {
		return !obj.hitted;
	}

	/**
	 * 
	 * @param {Fire} flame 
	 * @param {Bomb} bomb 
	 */
	flameVsBomb(flame, bomb) {

		bomb.anims.play("explosion");

		flame.active = false;
		flame.visible = false;
		flame.body.enable = false;

		bomb.hitted = true;
	}

	/**
	 * @param {Fire} flame
	 * @param {Melon} melon
	 */
	flameVsMelon(flame, melon) {

		melon.anims.play("Objects - burning-watermelon");

		melon.hitted = true;
	}

	requestNewObject() {

		this.time.addEvent({
			callback: this.spawnObject,
			callbackScope: this,
			delay: Phaser.Math.Between(2000, 3000)
		});
	}

	spawnObject() {

		let sprite;
		
		if (Math.random() <= .5) {

			sprite = this.bombs.find(obj => !obj.active);

		} else {

			sprite = this.melons.find(obj => !obj.active);
		}

		if (sprite) {

			sprite.spawnInLevel();
		}

		this.requestNewObject();
	}

	update() {

		// parallax

		let i = 0;

		const parallax = [4, 3, 2, 1, 0.5]

		for (var sprite of this.parallax) {

			sprite.x -= parallax[i];

			if (sprite.x < -sprite.width) {

				sprite.x = 800;
				//sprite.y = Phaser.Math.Between(0, 200);
			}

			i++;
		}
	}

	/* END-USER-CODE */
}

/* END OF COMPILED CODE */

// You can write more code here
