import Phaser from "phaser";

export default class ScriptNode {

    private _scene: Phaser.Scene;
    private _gameObject?: Phaser.GameObjects.GameObject;
    private _parent: ScriptNode | Phaser.GameObjects.GameObject | Phaser.Scene;
    private _children?: ScriptNode[];

    constructor(parent: ScriptNode | Phaser.GameObjects.GameObject | Phaser.Scene) {

        this._parent = parent;

        if (parent instanceof ScriptNode) {

            this._scene = parent.scene;
            this._gameObject = parent.gameObject;

            parent.add(this);

        } else if (parent instanceof Phaser.GameObjects.GameObject) {

            this._scene = parent.scene;
            this._gameObject = parent;

        } else {

            this._scene = parent;
        }

        const listenAwake = this.awake !== ScriptNode.prototype.awake;
        const listenStart = this.start !== ScriptNode.prototype.start;
        const listenUpdate = this.update !== ScriptNode.prototype.update;
        const listenDestroy = this.destroy !== ScriptNode.prototype.destroy;

        if (listenAwake) {

            this.scene.events.once("scene-awake", this.awake, this);
        }

        if (listenStart) {

            this.scene.events.once(Phaser.Scenes.Events.UPDATE, this.start, this);
        }

        if (listenUpdate) {

            this.scene.events.on(Phaser.Scenes.Events.UPDATE, this.update, this);
        }

        if (listenAwake || listenStart || listenUpdate || listenDestroy) {

            const destroyCallback = () => {

                this.scene.events.off("scene-awake", this.awake, this);
                this.scene.events.off(Phaser.Scenes.Events.UPDATE, this.start, this);
                this.scene.events.off(Phaser.Scenes.Events.UPDATE, this.update, this);

                if (listenDestroy) {

                    this.destroy();
                }
            };

            if (this.gameObject) {

                this.gameObject.on(Phaser.GameObjects.Events.DESTROY, destroyCallback);

            } else {

                this.scene.events.on(Phaser.Scenes.Events.SHUTDOWN, destroyCallback);
            }
        }
    }

    get scene() {

        return this._scene;
    }

    get gameObject() {

        return this._gameObject;
    }

    get parent() {

        return this._parent;
    }

    get children(): ScriptNode[] {

        if (!this._children) {

            this._children = [];
        }

        return this._children;
    }

    add(child: ScriptNode) {

        this.children.push(child);
    }

    executeChildren(...args: any[]) {

        if (this._children) {

            for(const child of this._children) {

                child.execute(...args);
            }
        }
    }

    execute(...args: any[]): void {
        // override this on executable nodes
    }

    protected awake() {
        // override this
    }

    protected start() {
        // override this
    }

    protected update() {
        // override this
    }

    protected destroy() {
        // override this
    }
}