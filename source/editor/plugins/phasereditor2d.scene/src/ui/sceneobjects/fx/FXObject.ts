namespace phasereditor2d.scene.ui.sceneobjects {

    export abstract class FXObject extends Phaser.GameObjects.GameObject implements ISceneGameObject {

        private _parent: ISceneGameObject;
        protected _phaserFX: Phaser.FX.Controller;
        private _preFX: boolean;

        constructor(scene: Scene, type: string, parent: ISceneGameObject, preFX: boolean) {
            super(scene, type);

            this._parent = parent;
            this._preFX = preFX;
        }

        abstract getEditorSupport(): GameObjectEditorSupport<ISceneGameObject>;

        removeFX() {

            const pipeline = this.getPipeline();

            pipeline.remove(this._phaserFX);

            this._phaserFX = undefined;
        }

        getPhaserFX() {

            return this._phaserFX;
        }

        getPipeline() {

            const obj = this._parent as unknown as Phaser.GameObjects.Image;

            return this._preFX ? obj.preFX : obj.postFX;
        }

        isPreFX() {

            return this._preFX;
        }

        setPreFX(preFX: boolean) {

            this._preFX = preFX;
        }

        getParent() {

            return this._parent;
        }

        setParent(parent: ISceneGameObject) {

            this._parent = parent;
        }

        getParentDisplayObject() {

            return this._parent;
        }

        removeFromParent() {

            this._parent.getEditorSupport().removeObjectChild(this);

            this._parent = undefined;
        }

        willRender(camera: Phaser.Cameras.Scene2D.Camera): boolean {

            return false;
        }
    }
}