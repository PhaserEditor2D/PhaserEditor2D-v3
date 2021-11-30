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
    game.scene.add("OriginMigration", OriginMigration);
    game.scene.add("Boot", Boot, true);
});
class Boot extends Phaser.Scene {
    preload() {
        this.load.pack("pack", "assets/asset-pack.json");
    }
    create() {
        this.scene.start("OriginMigration");
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
class Tint extends UserComponent {
    constructor(gameObject) {
        super(gameObject);
        this.gameObject = gameObject;
        gameObject["__Tint"] = this;
        /* START-USER-CTR-CODE */
        // Write your code here.
        /* END-USER-CTR-CODE */
        // custom definition props
        this.tint = "red";
    }
    static getComponent(gameObject) {
        return gameObject["__Tint"];
    }
    /* START-USER-CODE */
    set tint(tint) {
        switch (tint) {
            case "red":
                this.gameObject.setTint(0xff0000);
                break;
            case "green":
                this.gameObject.setTint(0x00ff00);
                break;
            case "blue":
                this.gameObject.setTint(0x0000ff);
                break;
        }
    }
}
/* END OF COMPILED CODE */
// You can write more code here
// You can write more code here
/* START OF COMPILED CODE */
class DinoPrefab extends Phaser.GameObjects.Image {
    constructor(scene, x, y, texture, frame) {
        super(scene, x ?? 408, y ?? 207, texture || "dino", frame);
        this.rotating = false;
        // this (components)
        new Tint(this);
        new PushOnClick(this);
        /* START-USER-CTR-CODE */
        // Write your code here.
        /* END-USER-CTR-CODE */
        // custom definition props
        this.origin = "top";
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
        super(scene, x ?? 0, y ?? 0);
        // dinoLeft
        const dinoLeft = new DinoPrefab(scene, 0, 0);
        this.add(dinoLeft);
        // dinoRight
        const dinoRight = new DinoPrefab(scene, 90, 166);
        this.add(dinoRight);
        // lists
        const testListInPrefab = [dinoRight, dinoLeft];
        this.dinoLeft = dinoLeft;
        this.dinoRight = dinoRight;
        this.testListInPrefab = testListInPrefab;
        /* START-USER-CTR-CODE */
        // Write your code here.
        /* END-USER-CTR-CODE */
        // custom definition props
        this.ghost = true;
    }
    /* START-USER-CODE */
    set ghost(ghost) {
        this.alpha = ghost ? 0.5 : 1;
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
        // dinoPrefab
        const dinoPrefab = new DinoPrefab(this, 186, 160);
        this.add.existing(dinoPrefab);
        // doubleDinoPrefab
        const doubleDinoPrefab = new DoubleDinoPrefab(this, 666, 35);
        this.add.existing(doubleDinoPrefab);
        // withAwakeEventPrefab
        const withAwakeEventPrefab = new WithAwakeEventPrefab(this, 415, 505);
        this.add.existing(withAwakeEventPrefab);
        // dino (components)
        const dinoPushOnClick = new PushOnClick(dino);
        dinoPushOnClick.pushScale = 0.8;
        new Tint(dino);
        // dinoPrefab (prefab fields)
        dinoPrefab.rotating = true;
        this.dino = dino;
        this.events.emit("scene-awake");
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
class TestListFieldScene extends Phaser.Scene {
    constructor() {
        super("TestListFieldScene");
        /* START-USER-CTR-CODE */
        // Write your code here.
        /* END-USER-CTR-CODE */
    }
    editorCreate() {
        // dino
        const dino = this.add.image(337, 193, "dino");
        // lists
        const list = [dino];
        const emptyList = [];
        this.list = list;
        this.emptyList = emptyList;
        this.events.emit("scene-awake");
    }
    /* START-USER-CODE */
    // Write your code here
    create() {
        this.editorCreate();
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
        this.events.emit("scene-awake");
    }
    /* START-USER-CODE */
    // Write your code here
    create() {
        this.editorCreate();
    }
}
/* END OF COMPILED CODE */
// You can write more code here
// You can write more code here
/* START OF COMPILED CODE */
class TextWordWrapScene extends Phaser.Scene {
    constructor() {
        super("TextWordWrapScene");
        /* START-USER-CTR-CODE */
        // Write your code here.
        /* END-USER-CTR-CODE */
    }
    editorCreate() {
        // text
        const text = this.add.text(114, 110, "", {});
        text.text = "New   long text   !";
        text.setStyle({ "fontFamily": "arial", "fontSize": "40px" });
        text.setWordWrapWidth(60, true);
        // text_1
        const text_1 = this.add.text(274, 142, "", {});
        text_1.text = "New text";
        text_1.setStyle({ "fontSize": "80px" });
        this.events.emit("scene-awake");
    }
    /* START-USER-CODE */
    // Write your code here
    create() {
        this.editorCreate();
    }
}
/* END OF COMPILED CODE */
// You can write more code here
// You can write more code here
/* START OF COMPILED CODE */
class ComponentWithAwake {
    constructor(gameObject) {
        this.gameObject = gameObject;
        gameObject["__ComponentWithAwake"] = this;
        /* START-USER-CTR-CODE */
        // Write your code here.
        /* END-USER-CTR-CODE */
    }
    static getComponent(gameObject) {
        return gameObject["__ComponentWithAwake"];
    }
}
/* END OF COMPILED CODE */
// You can write more code here
// You can write more code here
/* START OF COMPILED CODE */
class ComponentWithoutAwake {
    constructor(gameObject) {
        this.gameObject = gameObject;
        gameObject["__ComponentWithoutAwake"] = this;
        /* START-USER-CTR-CODE */
        // Write your code here.
        /* END-USER-CTR-CODE */
    }
    static getComponent(gameObject) {
        return gameObject["__ComponentWithoutAwake"];
    }
}
/* END OF COMPILED CODE */
// You can write more code here
// You can write more code here
/* START OF COMPILED CODE */
class TestComponentsAwakeEvent extends Phaser.Scene {
    constructor() {
        super("TestComponentsAwakeEvent");
        /* START-USER-CTR-CODE */
        // Write your code here.
        /* END-USER-CTR-CODE */
    }
    editorCreate() {
        // hasComponentsAwake
        const hasComponentsAwake = this.add.text(126, 183, "", {});
        hasComponentsAwake.text = "Has components-awake";
        hasComponentsAwake.setStyle({ "fontSize": "40px" });
        // doesntHaveComponentsAwake
        const doesntHaveComponentsAwake = this.add.text(130, 275, "", {});
        doesntHaveComponentsAwake.text = "Doesn't have components-awake";
        doesntHaveComponentsAwake.setStyle({ "fontSize": "40px" });
        // dinoPrefab
        const dinoPrefab = new DinoPrefab(this, 370, 475);
        this.add.existing(dinoPrefab);
        // hasComponentsAwake (components)
        new ComponentWithAwake(hasComponentsAwake);
        // doesntHaveComponentsAwake (components)
        new ComponentWithoutAwake(doesntHaveComponentsAwake);
        this.events.emit("scene-awake");
    }
    /* START-USER-CODE */
    // Write your code here
    create() {
        this.editorCreate();
    }
}
/* END OF COMPILED CODE */
// You can write more code here
// You can write more code here
/* START OF COMPILED CODE */
class BaseContainerPrefab extends Phaser.GameObjects.Container {
    constructor(scene, x, y) {
        super(scene, x ?? 42, y ?? 47);
        // rectangle
        const rectangle = scene.add.rectangle(0, 0, 575, 128);
        rectangle.setOrigin(0, 0);
        rectangle.isFilled = true;
        rectangle.fillColor = 10214835;
        this.add(rectangle);
        // text
        const text = scene.add.text(38, 40, "", {});
        text.text = "base container prefab";
        text.setStyle({ "color": "#fae1afff", "fontSize": "40px", "fontStyle": "bold" });
        this.add(text);
        this.rectangle = rectangle;
        this.text = text;
        /* START-USER-CTR-CODE */
        // Write your code here.
        /* END-USER-CTR-CODE */
    }
}
/* END OF COMPILED CODE */
// You can write more code here
// You can write more code here
/* START OF COMPILED CODE */
class DerivedContainer1Prefab extends BaseContainerPrefab {
    constructor(scene, x, y) {
        super(scene, x ?? 95, y ?? 47);
        this.text.setPosition(220, 70);
        this.text.text = "derived prefab";
        this.text.setStyle({ "color": "#f75bb1ff", "strokeThickness": 4 });
        /* START-USER-CTR-CODE */
        // Write your code here.
        /* END-USER-CTR-CODE */
    }
}
/* END OF COMPILED CODE */
// You can write more code here
// You can write more code here
/* START OF COMPILED CODE */
class Issue154 extends Phaser.Scene {
    constructor() {
        super("Issue154");
        /* START-USER-CTR-CODE */
        // Write your code here.
        /* END-USER-CTR-CODE */
    }
    editorCreate() {
        // derivedContainer1Prefab
        const derivedContainer1Prefab = new DerivedContainer1Prefab(this, 134, 96);
        this.add.existing(derivedContainer1Prefab);
        this.events.emit("scene-awake");
    }
    /* START-USER-CODE */
    // Write your code here
    create() {
        this.editorCreate();
    }
}
/* END OF COMPILED CODE */
// You can write more code here
// You can write more code here
/* START OF COMPILED CODE */
class AnotherPrefabPrefab extends Phaser.GameObjects.Container {
    constructor(scene, x, y) {
        super(scene, x ?? 0, y ?? -16.506139428920388);
        // coloredBlue
        const coloredBlue = scene.add.text(0, 16.506139428920388, "", {});
        coloredBlue.setOrigin(0.5, 0.5);
        coloredBlue.text = "This is another prefab";
        coloredBlue.setStyle({ "backgroundColor": "#00ccffff", "color": "#a93005ff", "fontSize": "40px" });
        this.add(coloredBlue);
        // coloredYellow
        const coloredYellow = scene.add.text(-6, 71, "", {});
        coloredYellow.setOrigin(0.5, 0.5);
        coloredYellow.text = "This is another prefab";
        coloredYellow.setStyle({ "backgroundColor": "#f4ff00ff", "color": "#a93005ff", "fontSize": "40px" });
        this.add(coloredYellow);
        this.coloredBlue = coloredBlue;
        this.coloredYellow = coloredYellow;
        /* START-USER-CTR-CODE */
        // Write your code here.
        /* END-USER-CTR-CODE */
    }
}
/* END OF COMPILED CODE */
// You can write more code here
// You can write more code here
/* START OF COMPILED CODE */
class NestedInsideContainerPrefabInstanceScene extends Phaser.Scene {
    constructor() {
        super("NestedInsideContainerPrefabInstanceScene");
        /* START-USER-CTR-CODE */
        // Write your code here.
        /* END-USER-CTR-CODE */
    }
    editorCreate() {
        // obj1
        const obj1 = new NestedPrefabInContainerPrefab(this, 66, 107);
        this.add.existing(obj1);
        obj1.multicolor.coloredBlue.setStyle({ "backgroundColor": "#001dffff", "color": "#f7f5f4ff" });
        obj1.nestedTextInsideContainer.text = "nested text inside container (updated)";
        this.events.emit("scene-awake");
    }
    /* START-USER-CODE */
    // Write your code here
    create() {
        this.editorCreate();
    }
}
/* END OF COMPILED CODE */
// You can write more code here
// You can write more code here
/* START OF COMPILED CODE */
class NestedPrefabInContainerPrefab extends Phaser.GameObjects.Container {
    constructor(scene, x, y) {
        super(scene, x ?? 223, y ?? 114);
        // multicolor
        const multicolor = new AnotherPrefabPrefab(scene, 282, 188);
        this.add(multicolor);
        // nestedText
        const nestedText = scene.add.text(0, 0, "", {});
        nestedText.text = "nested text 1";
        nestedText.setStyle({ "fontFamily": "courier", "fontSize": "40px" });
        this.add(nestedText);
        // containerOfNested
        const containerOfNested = scene.add.container(0, 98);
        this.add(containerOfNested);
        // nestedTextInsideContainer
        const nestedTextInsideContainer = scene.add.text(0, 0, "", {});
        nestedTextInsideContainer.text = "nested text inside container";
        nestedTextInsideContainer.setStyle({ "fontFamily": "courier", "fontSize": "40px" });
        containerOfNested.add(nestedTextInsideContainer);
        this.multicolor = multicolor;
        this.nestedText = nestedText;
        this.containerOfNested = containerOfNested;
        this.nestedTextInsideContainer = nestedTextInsideContainer;
        /* START-USER-CTR-CODE */
        // Write your code here.
        /* END-USER-CTR-CODE */
    }
}
/* END OF COMPILED CODE */
// You can write more code here
// You can write more code here
/* START OF COMPILED CODE */
class OriginMigration extends Phaser.Scene {
    constructor() {
        super("OriginMigration");
        /* START-USER-CTR-CODE */
        // Write your code here.
        /* END-USER-CTR-CODE */
    }
    editorCreate() {
        // textWithOriginPrefab
        const textWithOriginPrefab = new TextWithOriginPrefab(this, 205, 269);
        this.add.existing(textWithOriginPrefab);
        textWithOriginPrefab.setOrigin(0.5, 0.5);
        this.events.emit("scene-awake");
    }
    /* START-USER-CODE */
    // Write your code here
    create() {
        this.editorCreate();
    }
}
/* END OF COMPILED CODE */
// You can write more code here
// You can write more code here
/* START OF COMPILED CODE */
class TextWithOriginPrefab extends Phaser.GameObjects.Text {
    constructor(scene, x, y) {
        super(scene, x ?? 407, y ?? 224, "", {});
        this.setOrigin(0.5, 0.5);
        this.text = "Text Prefab\nOrigin 0.5";
        this.setStyle({ "backgroundColor": "#7bfb6eff", "fontFamily": "serif", "fontSize": "40px", "stroke": "#000000ff", "strokeThickness": 2 });
        this.setLineSpacing(20);
        /* START-USER-CTR-CODE */
        // Write your code here.
        /* END-USER-CTR-CODE */
    }
}
/* END OF COMPILED CODE */
// You can write more code here
// You can write more code here
/* START OF COMPILED CODE */
class PrefabAwakeTest extends Phaser.Scene {
    constructor() {
        super("PrefabAwakeTest");
        /* START-USER-CTR-CODE */
        // Write your code here.
        /* END-USER-CTR-CODE */
    }
    editorCreate() {
        // withoutAwakeEventPrefab
        const withoutAwakeEventPrefab = new WithoutAwakeEventPrefab(this, 59, 79);
        this.add.existing(withoutAwakeEventPrefab);
        // withAwakeEventPrefab
        const withAwakeEventPrefab = new WithAwakeEventPrefab(this, 99, 197);
        this.add.existing(withAwakeEventPrefab);
        this.events.emit("scene-awake");
    }
    /* START-USER-CODE */
    // Write your code here
    create() {
        this.editorCreate();
    }
}
/* END OF COMPILED CODE */
// You can write more code here
// You can write more code here
/* START OF COMPILED CODE */
class WithAwakeEventPrefab extends Phaser.GameObjects.Text {
    constructor(scene, x, y) {
        super(scene, x ?? 276.5, y ?? 19, "", {});
        this.setOrigin(0.5, 0.5);
        this.text = "Prefab with awake event";
        this.setStyle({ "backgroundColor": "#db68f7ff", "fontSize": "40px" });
        // awake handler
        this.scene.events.once("scene-awake", () => this.awake());
        /* START-USER-CTR-CODE */
        // Write your code here.
        /* END-USER-CTR-CODE */
    }
    /* START-USER-CODE */
    awake() {
        this.angle = -10;
    }
}
/* END OF COMPILED CODE */
// You can write more code here
// You can write more code here
/* START OF COMPILED CODE */
class WithoutAwakeEventPrefab extends Phaser.GameObjects.Text {
    constructor(scene, x, y) {
        super(scene, x ?? 0, y ?? 0, "", {});
        this.text = "Prefab Without Awake Event";
        this.setStyle({ "backgroundColor": "#1e87a1ff", "fontSize": "40px" });
        this.setPadding({ "left": 10, "top": 10, "right": 10, "bottom": 10 });
        /* START-USER-CTR-CODE */
        // Write your code here.
        /* END-USER-CTR-CODE */
    }
}
/* END OF COMPILED CODE */
// You can write more code here
