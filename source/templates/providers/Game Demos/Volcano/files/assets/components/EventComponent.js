class EventComponent {

    /**
     * @param {Phaser.GameObjects.GameObject} gameObject
     */
    constructor(gameObject) {        
        
        this.scene = gameObject.scene;        
        
        this.scene.events.once(Phaser.Scenes.Events.UPDATE, this.start, this);
        this.scene.events.on(Phaser.Scenes.Events.UPDATE, this.update, this);
        gameObject.on(Phaser.GameObjects.Events.DESTROY, this.destroy, this);        
    }

    start() {
        
    }

    destroy() {

        this.scene.events.off(Phaser.Scenes.Events.UPDATE, this.start, this);
        this.scene.events.off(Phaser.Scenes.Events.UPDATE, this.update, this);
    }

    update() {

    }
}