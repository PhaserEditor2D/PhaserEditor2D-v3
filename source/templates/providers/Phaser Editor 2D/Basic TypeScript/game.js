var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
window.addEventListener('load', function () {
    var game = new Phaser.Game({
        width: 800,
        height: 600,
        type: Phaser.AUTO,
        backgroundColor: "#242424",
        scale: {
            mode: Phaser.Scale.FIT,
            autoCenter: Phaser.Scale.CENTER_BOTH
        }
    });
    game.scene.add("Level", Level);
    game.scene.add("Boot", Boot, true);
});
var Boot = /** @class */ (function (_super) {
    __extends(Boot, _super);
    function Boot() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Boot.prototype.preload = function () {
        this.load.pack("pack", "assets/asset-pack.json");
    };
    Boot.prototype.create = function () {
        this.scene.start("Level");
    };
    return Boot;
}(Phaser.Scene));
// You can write more code here
/* START OF COMPILED CODE */
var Level = /** @class */ (function (_super) {
    __extends(Level, _super);
    function Level() {
        return _super.call(this, "Level") || this;
    }
    Level.prototype.create = function () {
        // dino
        this.add.image(400, 245.50984430371858, "dino");
        // text_1
        var text_1 = this.add.text(400, 400, "", {});
        text_1.setOrigin(0.5, 0);
        text_1.text = "Welcome to Phaser Editor 2D!";
        text_1.setStyle({ "fontSize": "24px", "fontStyle": "bold" });
    };
    return Level;
}(Phaser.Scene));
/* END OF COMPILED CODE */
// You can write more code here
