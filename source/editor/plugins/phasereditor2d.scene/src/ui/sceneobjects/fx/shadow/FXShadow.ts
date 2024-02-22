/// <reference path="../FXObject.ts" />
namespace phasereditor2d.scene.ui.sceneobjects {

    export class FXShadow extends FXObject {

        private _editorSupport: FXShadowEditorSupport;

        constructor(scene: Scene, parent: ISceneGameObject, preFX: boolean) {
            super(scene, FXShadowExtension.getInstance().getTypeName(), parent, preFX);

            const pipeline = this.getPipeline();

            this._phaserFX = pipeline.addShadow();

            this._editorSupport = new FXShadowEditorSupport(this, scene);
        }

        getPhaserFX(): Phaser.FX.Shadow {
            
            return super.getPhaserFX() as Phaser.FX.Shadow;
        }

        getEditorSupport() {
            
            return this._editorSupport;
        }
    }
}