import Phaser from "phaser";
import Level from "./scenes/Level";


class Boot extends Phaser.Scene {

	preload() {

		this.load.pack("pack", "assets/asset-pack.json");
	}

	create() {

		this.scene.start("Level");
	}
}

const game = new Phaser.Game({
	type: Phaser.AUTO,
	width: 800,
	height: 600,
	backgroundColor: "#424242",
	scale: {
		autoCenter: Phaser.Scale.CENTER_BOTH,
		mode: Phaser.Scale.ScaleModes.FIT	
	},
	scene: [Boot, Level]
});

game.scene.start("Boot");