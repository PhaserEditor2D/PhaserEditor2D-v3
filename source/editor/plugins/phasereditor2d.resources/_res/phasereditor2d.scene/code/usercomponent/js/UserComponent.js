class UserComponent {

    /**
     * @param {Phaser.GameObjects.GameObject} gameObject The entity.
     */
    constructor(gameObject) {

        this.scene = gameObject.scene;

        const listenAwake = this.awake !== UserComponent.prototype.awake;
        const listenStart = this.start !== UserComponent.prototype.start;
        const listenUpdate = this.update !== UserComponent.prototype.update;
        const listenDestroy = this.destroy !== UserComponent.prototype.destroy;
        
        if (listenAwake) {

            this.scene.events.once("scene-awake", this.awake, this);
        }

        if (listenStart) {

            this.scene.events.once(Phaser.Scenes.Events.UPDATE, this.start, this);
        }

        if (listenUpdate) {

            this.scene.events.on(Phaser.Scenes.Events.UPDATE, this.update, this);
        }

        if (listenStart || listenUpdate || listenDestroy) {

            gameObject.on(Phaser.GameObjects.Events.DESTROY, () => {

                this.scene.events.off(Phaser.Scenes.Events.UPDATE, this.start, this);
                this.scene.events.off(Phaser.Scenes.Events.UPDATE, this.update, this);

                if (listenDestroy) {

                    this.destroy();
                }
            });
        }
    }

    /** @type {Phaser.Scene} */
    scene;

    awake() {
        // override this
    }

    start() {
        // override this
    }

    update() {
        // override this
    }

    destroy() {
        // override this
    }
}