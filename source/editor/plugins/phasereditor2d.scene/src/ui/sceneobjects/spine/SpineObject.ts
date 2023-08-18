namespace phasereditor2d.scene.ui.sceneobjects {

    export class SpineObject extends spine.SpineGameObject implements ISceneGameObject {

        private _editorSupport: SpineEditorSupport;
        public dataKey: string;
        public atlasKey: string;

        constructor(scene: Scene, x: number, y: number, dataKey: string, atlasKey: string) {
            // TODO: missing bounds provider
            super(scene, scene.spine, x, y, dataKey, atlasKey);

            this.dataKey = dataKey;
            this.atlasKey = atlasKey;

            const skins = this.skeleton.data.skins.map(skin => skin.name);

            this.boundsProvider = new spine.SkinsAndAnimationBoundsProvider(null, skins);

            this.updateSize();

            this._editorSupport = new SpineEditorSupport(this, scene);
        }

        setFirstSkin() {

            const skin = this.skeleton.data.skins[0];

            if (skin) {

                this.skeleton.setSkin(skin);
                this.skeleton.setSlotsToSetupPose();
            }
        }

        getEditorSupport() {

            return this._editorSupport;
        }
    }
}