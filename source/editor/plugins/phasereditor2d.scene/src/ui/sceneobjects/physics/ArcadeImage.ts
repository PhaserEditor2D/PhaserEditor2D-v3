namespace phasereditor2d.scene.ui.sceneobjects {

    export class ArcadeImage extends Phaser.Physics.Arcade.Image implements ISceneGameObject {

        private _editorSupport: ArcadeImageEditorSupport;

        constructor(
            scene: Scene, x: number, y: number, texture: string, frame?: string | number) {

            super(scene, x, y, texture, frame);

            this._editorSupport = new ArcadeImageEditorSupport(this, scene);

            this.body = new Phaser.Physics.Arcade.Body(scene.physics.world, this);
            this.body.enable = false;
        }

        getEditorSupport(): ArcadeImageEditorSupport {

            return this._editorSupport;
        }
    }
}