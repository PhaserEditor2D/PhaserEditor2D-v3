
// You can write more code here

/* START OF COMPILED CODE */

class Preloader extends Phaser.Scene {

	constructor() {
		super("Preloader");

		/* START-USER-CTR-CODE */
		// Write your code here.
		/* END-USER-CTR-CODE */
	}

	/** @returns {void} */
	editorPreload() {

		this.load.pack("asset-pack", "assets/asset-pack.json");
	}

	/** @returns {void} */
	editorCreate() {

		// loading
		const loading = this.add.image(144, 96, "loading");

		this.loading = loading;

		this.events.emit("scene-awake");
	}

	/** @type {Phaser.GameObjects.Image} */
	loading;

	/* START-USER-CODE */

	preload() {		

		this.editorCreate();

		this.loading.scaleX = 0;

		this.load.on(Phaser.Loader.Events.PROGRESS, p => {

			this.loading.scaleX = p;
		});		

		this.editorPreload();
	}

	create() {

		this.scene.start("TitleScreen");		
	}

	/* END-USER-CODE */
}

/* END OF COMPILED CODE */

// You can write more code here
