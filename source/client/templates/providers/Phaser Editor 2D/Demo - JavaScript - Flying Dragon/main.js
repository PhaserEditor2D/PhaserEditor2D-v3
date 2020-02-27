
window.addEventListener('load', function () {

	var game = new Phaser.Game({
		width: 800,
		height: 450,
		type: Phaser.AUTO,
		backgroundColor: "#242424",
		scale: {
			mode: Phaser.Scale.FIT,
			autoCenter: Phaser.Scale.CENTER_BOTH
		},
		physics: {
			default: "arcade",
			arcade: {
				gravity: {
					y: 400
				},
				debug: false
			}
		}
	});

	game.scene.add("Boot", Boot, true);
});

class Boot extends Phaser.Scene {

	preload() {

		this.load.pack("pack", "assets/asset-pack.json");
	}

	create() {

		this.scene.start("Level");
	}
}