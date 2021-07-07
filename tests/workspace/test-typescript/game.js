"use strict";
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
class Boot extends Phaser.Scene {
    preload() {
        this.load.pack("pack", "assets/asset-pack.json");
    }
    create() {
        this.scene.start("Level");
    }
}
class UserComponent {
    /**
     * @param gameObject The entity.
     */
    constructor(gameObject) {
        this.scene = gameObject.scene;
        const listenAwake = this.awake !== UserComponent.prototype.awake;
        const listenStart = this.start !== UserComponent.prototype.start;
        const listenUpdate = this.update !== UserComponent.prototype.update;
        const listenDestroy = this.destroy !== UserComponent.prototype.destroy;
        if (listenAwake) {
            gameObject.once("components-awake", this.awake, this);
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
/// <reference path="./UserComponent.ts"/>
// You can write more code here
/* START OF COMPILED CODE */
class PushOnClick extends UserComponent {
    constructor(gameObject) {
        super(gameObject);
        this.pushScale = 0.5;
        this.gameObject = gameObject;
        gameObject["__PushOnClick"] = this;
        /* START-USER-CTR-CODE */
        // Write your code here.
        /* END-USER-CTR-CODE */
    }
    static getComponent(gameObject) {
        return gameObject["__PushOnClick"];
    }
    /* START-USER-CODE */
    awake() {
        this.gameObject.setInteractive().on("pointerdown", () => {
            this.scene.add.tween({
                targets: this.gameObject,
                scaleX: this.pushScale,
                scaleY: this.pushScale,
                duration: 80,
                yoyo: true
            });
        });
    }
}
/* END OF COMPILED CODE */
// You can write more code here
// You can write more code here
/* START OF COMPILED CODE */
class DinoPrefab extends Phaser.GameObjects.Image {
    constructor(scene, x, y, texture, frame) {
        super(scene, x, y, texture || "dino", frame);
        this.rotating = false;
        this.origin = "center";
        /* START-USER-CTR-CODE */
        this.once("prefab-awake", () => {
            if (this.rotating) {
                this.scene.events.on("update", () => {
                    this.angle += 1;
                });
            }
        });
        /* END-USER-CTR-CODE */
    }
    /* START-USER-CODE */
    set origin(origin) {
        switch (origin) {
            case "top":
                this.setOrigin(0.5, 0);
                break;
            case "center":
                this.setOrigin(0.5, 0.5);
                break;
            case "bottom":
                this.setOrigin(0.5, 1);
                break;
        }
    }
}
/* END OF COMPILED CODE */
// You can write more code here
// You can write more code here
/* START OF COMPILED CODE */
class DoubleDinoPrefab extends Phaser.GameObjects.Container {
    constructor(scene, x, y) {
        super(scene, x, y);
        // dinoLeft
        const dinoLeft = new DinoPrefab(scene, 0, 0);
        this.add(dinoLeft);
        // dinoRight
        const dinoRight = new DinoPrefab(scene, 90, 166);
        this.add(dinoRight);
        // dinoLeft (prefab fields)
        dinoLeft.emit("prefab-awake");
        // dinoRight (prefab fields)
        dinoRight.emit("prefab-awake");
        this.dinoLeft = dinoLeft;
        this.dinoRight = dinoRight;
        /* START-USER-CTR-CODE */
        // Write your code here.
        /* END-USER-CTR-CODE */
    }
}
/* END OF COMPILED CODE */
// You can write more code here
// You can write more code here
/* START OF COMPILED CODE */
class Level extends Phaser.Scene {
    constructor() {
        super("Level");
        /* START-USER-CTR-CODE */
        // Write your code here.
        /* END-USER-CTR-CODE */
    }
    editorCreate() {
        // dino
        const dino = this.add.image(400, 245.50984430371858, "dino");
        // text_1
        const text_1 = this.add.text(400, 406, "", {});
        text_1.setOrigin(0.5, 0);
        text_1.text = "Phaser 3 + Phaser Editor 2D + TypeScript";
        text_1.setStyle({ "fontFamily": "arial", "fontSize": "3em" });
        text_1.setWordWrapWidth(0, false);
        // dino_1
        const dino_1 = new DinoPrefab(this, 186, 160);
        this.add.existing(dino_1);
        // container_1
        const container_1 = new DoubleDinoPrefab(this, 666, 35);
        this.add.existing(container_1);
        // dino (components)
        const dinoPushOnClick = new PushOnClick(dino);
        dinoPushOnClick.pushScale = 0.8;
        dino.emit("components-awake");
        // dino_1 (prefab fields)
        dino_1.rotating = true;
        dino_1.origin = "bottom";
        dino_1.emit("prefab-awake");
        // container_1 (prefab fields)
        container_1.emit("prefab-awake");
        this.dino = dino;
    }
    /* START-USER-CODE */
    // Write your code here.
    create() {
        this.editorCreate();
    }
    update() {
        if (this.dino) {
            this.dino.y -= 1;
        }
    }
}
/* END OF COMPILED CODE */
// You can write more code here
// You can write more code here
/* START OF COMPILED CODE */
class TestOneObjectScene extends Phaser.Scene {
    constructor() {
        super("TestOneObjectScene");
        /* START-USER-CTR-CODE */
        // Write your code here.
        /* END-USER-CTR-CODE */
    }
    editorCreate() {
        // dino
        const dino = this.add.image(482, 178, "dino");
        this.dino = dino;
    }
    /* START-USER-CODE */
    // Write your code here
    create() {
        this.editorCreate();
    }
}
/* END OF COMPILED CODE */
// You can write more code here
