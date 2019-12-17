
window.addEventListener('load', function () {

	var game = new Phaser.Game({
		width: 800,
		height: 600,
		type: Phaser.AUTO,
		scale: {
			mode: Phaser.Scale.FIT,
			autoCenter: Phaser.Scale.CENTER_BOTH
		}
	});
	
	game.scene.add("Boot", Boot, true);

});

class Boot extends Phaser.Scene {

	preload() {
		
		this.load.pack("pack", "assets/asset-pack.json");
	}

	create() {
		
		const camera = this.cameras.main;
		
		camera.backgroundColor = Phaser.Display.Color.HexStringToColor("#aaf");

		this.add.image(camera.centerX, camera.centerY, "dino");
	}

}