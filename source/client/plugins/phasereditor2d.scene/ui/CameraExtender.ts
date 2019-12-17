namespace Phaser.Cameras.Scene2D {
    export interface Camera {
        getScreenPoint(worldX: number, worldY: number): Phaser.Math.Vector2;
    }
}

namespace phasereditor2d.scene.ui {

    Phaser.Cameras.Scene2D.Camera.prototype.getScreenPoint = function (worldX: number, worldY: number) {

        let x = worldX * this.zoom - this.scrollX * this.zoom;
        let y = worldY * this.zoom - this.scrollY * this.zoom;

        return new Phaser.Math.Vector2(x, y);
    };

}

