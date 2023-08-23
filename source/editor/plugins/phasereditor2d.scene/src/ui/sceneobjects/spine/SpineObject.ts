namespace phasereditor2d.scene.ui.sceneobjects {

    export enum BoundsProviderType {
        SETUP_TYPE = "SETUP POSE",
        SKINS_AND_ANIMATION_TYPE = "SKINS AND ANIMATION"
    }

    export enum BoundsProviderSkin {
        ALL_SKINS = "ALL",
        CURRENT_SKIN = "CURRENT"
    }

    export class SpineObject extends spine.SpineGameObject implements ISceneGameObject {

        static DEFAULT_BP_TIME_STEP = 0.05;

        private _editorSupport: SpineEditorSupport;
        public dataKey: string;
        public atlasKey: string;
        public boundsProviderType: BoundsProviderType;
        public boundsProviderSkin: BoundsProviderSkin;
        public boundsProviderAnimation: string;
        public boundsProviderTimeStep: number;

        constructor(scene: Scene, x: number, y: number, dataKey: string, atlasKey: string) {
            // TODO: missing bounds provider
            super(scene, scene.spine, x, y, dataKey, atlasKey);

            this.dataKey = dataKey;
            this.atlasKey = atlasKey;

            this.boundsProviderType = BoundsProviderType.SETUP_TYPE;
            this.boundsProviderSkin = BoundsProviderSkin.CURRENT_SKIN;
            this.boundsProviderAnimation = null;
            this.boundsProviderTimeStep = SpineObject.DEFAULT_BP_TIME_STEP;

            // const skins = this.skeleton.data.skins.map(skin => skin.name);
            // this.boundsProvider = new spine.SkinsAndAnimationBoundsProvider(null, skins);
            // this.updateSize();

            this._editorSupport = new SpineEditorSupport(this, scene);
        }

        updateBoundsProvider() {

            if (this.boundsProviderType === BoundsProviderType.SETUP_TYPE) {

                this.boundsProvider = new spine.SetupPoseBoundsProvider();
                this.updateSize();

            } else {

                try {

                    let skins: string[] = [];

                    if (this.boundsProviderSkin === BoundsProviderSkin.CURRENT_SKIN) {

                        if (this.skeleton.skin) {

                            skins = [this.skeleton.skin.name];
                        }

                    } else {

                        skins = this.skeleton.data.skins.map(s => s.name);
                    }

                    // TODO: missing timeStep argument

                    this.boundsProvider = new spine.SkinsAndAnimationBoundsProvider(
                        this.boundsProviderAnimation, skins, this.boundsProviderTimeStep);

                    this.updateSize();

                } catch (e) {

                    console.error(e);

                    alert(e.message);
                }
            }

            this.setInteractive();
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