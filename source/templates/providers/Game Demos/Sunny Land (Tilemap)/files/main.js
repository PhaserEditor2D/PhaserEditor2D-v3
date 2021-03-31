
window.addEventListener('load', function () {

	var game = new Phaser.Game({
		width: 288,
		height: 192,
		type: Phaser.AUTO,
        backgroundColor: "#242424",
		scale: {
			mode: Phaser.Scale.FIT,
			autoCenter: Phaser.Scale.CENTER_BOTH
		},		
		physics: {
			default: "arcade",
			arcade: {
				debug: false				
			}			
		},
		render: {
			pixelArt: true			
		},
		input: {
			activePointers: 3
		}
	});
	
	game.scene.add("Boot", Boot, true);
});

class Boot extends Phaser.Scene {

	preload() {
		
		this.load.pack("pack", "assets/preload-pack.json");
	}

	create() {
		
		this.scene.start("Preloader");
	}

}