namespace phasereditor2d.scene.ui.sceneobjects {

    export class ArcadeImage extends Phaser.Physics.Arcade.Image implements ISceneGameObject {

        private _editorSupport: ArcadeImageEditorSupport;
        
        constructor(
            scene: Scene, x: number, y: number, texture: string, frame?: string | number) {

            super(scene, x, y, texture, frame);

            this._editorSupport = new ArcadeImageEditorSupport(this, scene);
        }

        getEditorSupport(): ArcadeImageEditorSupport {

            return this._editorSupport;
        }
    }
}