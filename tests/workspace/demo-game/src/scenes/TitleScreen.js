
// You can write more code here

/* START OF COMPILED CODE */

class TitleScreen extends Phaser.Scene {

	constructor() {
		super("TitleScreen");

		/* START-USER-CTR-CODE */
		// Write your code here.
		/* END-USER-CTR-CODE */
	}

	/** @returns {void} */
	editorCreate() {

		// background
		const background = this.add.tileSprite(0, 0, 384, 240, "back");
		background.setOrigin(0, 0);

		// middle
		const middle = this.add.tileSprite(0, 80, 384, 368, "middle");
		middle.setOrigin(0, 0);

		// title_screen
		const title_screen = this.add.image(144, 90, "title-screen");

		// credits_text
		this.add.image(144, 174, "credits-text");

		// press_enter_text
		const press_enter_text = this.add.image(144, 149, "press-enter-text");

		// instructions
		const instructions = this.add.image(144, 0, "instructions");
		instructions.setOrigin(0.5, 0);
		instructions.visible = false;

		this.background = background;
		this.middle = middle;
		this.title_screen = title_screen;
		this.press_enter_text = press_enter_text;
		this.instructions = instructions;

		this.events.emit("scene-awake");
	}

	/** @type {Phaser.GameObjects.TileSprite} */
	background;
	/** @type {Phaser.GameObjects.TileSprite} */
	middle;
	/** @type {Phaser.GameObjects.Image} */
	title_screen;
	/** @type {Phaser.GameObjects.Image} */
	press_enter_text;
	/** @type {Phaser.GameObjects.Image} */
	instructions;

	/* START-USER-CODE */

	create() {

		this.editorCreate();

		this.input.keyboard.on("keydown-ENTER", this.enterPressed, this);
		this.input.on("pointerdown", this.enterPressed, this);

		this.blinkText();
	}

	enterPressed() {

		if (this.title_screen.visible) {

			this.title_screen.visible = false;
			this.instructions.visible = true;

		} else {

			this.scene.start("Level");
		}
	}

	blinkText() {

		this.time.addEvent({
			repeat: -1,
			delay: 1000,
			callback: () => {
				this.press_enter_text.visible = !this.press_enter_text.visible;
			}
		});
	}

	update() {

		this.background.tilePositionX += 0.3;
		this.middle.tilePositionX += 0.6;
	}

	/* END-USER-CODE */
}

/* END OF COMPILED CODE */

// You can write more code here
