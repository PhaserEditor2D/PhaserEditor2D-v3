namespace phasereditor2d.scene.ui.sceneobjects {

    export class ArcadeSprite extends Phaser.Physics.Arcade.Image implements ISceneGameObject {

        private _editorSupport: ArcadeSpriteEditorSupport;

        constructor(
            scene: Scene, x: number, y: number, texture: string, frame?: string | number) {

            super(scene, x, y, texture, frame);

            this._editorSupport = new ArcadeSpriteEditorSupport(this, scene);

            this.body = new Phaser.Physics.Arcade.Body(scene.physics.world, this);
            this.body.enable = false;
        }

        getEditorSupport() {

            return this._editorSupport;
        }
    }
}