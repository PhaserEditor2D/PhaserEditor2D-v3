/// <reference path="../FXObject.ts" />
namespace phasereditor2d.scene.ui.sceneobjects {

    export class FXGlow extends FXObject {

        private _editorSupport: FXGlowEditorSupport;

        constructor(scene: Scene, parent: ISceneGameObject, preFX: boolean) {
            super(scene, FXGlowExtension.getInstance().getTypeName(), parent, preFX);

            const pipeline = this.getPipeline();

            this._phaserFX = pipeline.addGlow();

            this._editorSupport = new FXGlowEditorSupport(this, scene);
        }

        getPhaserFX(): Phaser.FX.Glow {
            
            return super.getPhaserFX() as Phaser.FX.Glow;
        }

        getEditorSupport() {
            
            return this._editorSupport;
        }
    }
}