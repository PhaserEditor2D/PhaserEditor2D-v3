import Phaser from "phaser";
import Level from "./scenes/Level";
import assetPackUrl from "../static/assets/asset-pack.json"

class Boot extends Phaser.Scene {

    constructor() {
        super("Boot");
    }

    preload() {

        this.load.pack("pack", assetPackUrl);
    }

    create() {

       this.scene.start("Level");
    }
}

const game = new Phaser.Game({
    width: 800,
    height: 600,
    backgroundColor: "#2f2f2f",
    scale: {
        mode: Phaser.Scale.ScaleModes.FIT,
        autoCenter: Phaser.Scale.Center.CENTER_BOTH
    },
    scene: [Boot, Level]
});

game.scene.start("Boot");


