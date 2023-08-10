namespace phasereditor2d.scene.ui.sceneobjects {

    export class SpineObject extends spine.SpineGameObject implements ISceneGameObject {

        private _editorSupport: SpineEditorSupport;

        constructor(scene: Scene, x: number, y: number, dataKey: string, atlasKey: string) {
            // TODO: missing bounds provider
            super(scene, scene.spine, x, y, dataKey, atlasKey);

            this._editorSupport = new SpineEditorSupport(SpineExtension.getInstance(), this, scene);
        }

        getEditorSupport() {
            
            return this._editorSupport as any;
        }
    }
}