/// <reference path="./FXObject.ts" />
namespace phasereditor2d.scene.ui.sceneobjects {

    export class FXGlow extends FXObject {

        private _editorSupport: FXGlowEditorSupport;

        constructor(scene: Scene, parent: ISceneGameObject, preFX: boolean) {
            super(scene, FXGlowExtension.getInstance().getTypeName(), parent, preFX);

            const pipeline = this.getPipeline();

            this._phaserFX = pipeline.addGlow();

            parent.getEditorSupport().addObjectChild(this);

            this._editorSupport = new FXGlowEditorSupport(this, scene);
        }

        getEditorSupport() {
            
            return this._editorSupport;
        }
    }
}