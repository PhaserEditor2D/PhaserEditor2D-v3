namespace phasereditor2d.scene.ui.sceneobjects {

    export class SpineObject extends spine.SpineGameObject implements ISceneGameObject {

        private _editorSupport: SpineEditorSupport;
        private _dataKey: string;
        private _atlasKey: string;

        constructor(scene: Scene, x: number, y: number, dataKey: string, atlasKey: string) {
            // TODO: missing bounds provider
            super(scene, scene.spine, x, y, dataKey, atlasKey);

            this._dataKey = dataKey;
            this._atlasKey = atlasKey;

            this._editorSupport = new SpineEditorSupport(this, scene);

            const skins = this.skeleton.data.skins.map(skin => skin.name);

            this.boundsProvider = new spine.SkinsAndAnimationBoundsProvider(null, skins);

            this.updateSize();
        }

        getDataKey() {

            return this._dataKey;
        }

        getAtlasKey() {

            return this._atlasKey;
        }

        getEditorSupport() {
            
            return this._editorSupport;
        }
    }
}