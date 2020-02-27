
class BaseObject extends Phaser.GameObjects.Sprite {

    /**
     * 
     * @param {Phaser.Scene} scene 
     * @param {number} x 
     * @param {number} y 
     * @param {string} texture 
     * @param {string|number} frame 
     */
    constructor(scene, x, y, texture, frame) {
        super(scene, x, y, texture, frame);

        scene.physics.add.existing(this);

        this.body.allowGravity = false;

        this.active = false;
        this.visible = false;

        this.hitted = false;
    }

    spawnInLevel() {

        this.active = true;
        this.visible = true;
        this.hitted = false;

        this.body.velocity.x = -300;

        this.x = 800 + this.width - this.displayOriginX;
        this.y = Phaser.Math.Between(this.height, 450 - this.height);

        this.playDefaultAnimation();
    }

    preUpdate(time, delta) {

        super.preUpdate(time, delta);


        if (this.active && this.x + this.width < 0) {
            // out of world
            this.active = false;
            this.visible = false;
        }

        if (this.active && !this.visible) {
            this.active = false;
        }
    }

    playDefaultAnimation() {
        // should be overridden by derived classes
    }
}