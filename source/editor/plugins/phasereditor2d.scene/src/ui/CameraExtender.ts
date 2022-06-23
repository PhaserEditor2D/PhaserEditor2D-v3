namespace Phaser.Cameras.Scene2D {

    // tslint:disable-next-line:interface-name
    export interface Camera {

        getScreenPoint(worldX: number, worldY: number): Phaser.Math.Vector2;

        getWorldPoint2(screenX: number, screenY: number): Phaser.Math.Vector2;
    }
}

namespace phasereditor2d.scene.ui {

    Phaser.Cameras.Scene2D.Camera.prototype.getScreenPoint = function(worldX: number, worldY: number) {

        const x = (worldX - this.scrollX) * this.zoom;
        const y = (worldY - this.scrollY) * this.zoom;

        return new Phaser.Math.Vector2(x, y);
    };

    Phaser.Cameras.Scene2D.Camera.prototype.getWorldPoint2 = function(screenX: number, screenY: number) {

        const x = screenX / this.zoom + this.scrollX;
        const y = screenY / this.zoom + this.scrollY;

        return new Phaser.Math.Vector2(x, y);
    };
}