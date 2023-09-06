namespace phasereditor2d.scene.ui.sceneobjects {

    export enum BoundsProviderType {
        SETUP_TYPE,
        SKINS_AND_ANIMATION_TYPE
    }

    export enum BoundsProviderSkin {
        ALL_SKINS,
        CURRENT_SKIN
    }

    export type IAnimationMix = [string, string, number];
    
    export type IAnimationMixes = Array<IAnimationMix>;

    export class SpineObject extends spine.SpineGameObject implements ISceneGameObject {

        static DEFAULT_BP_TIME_STEP = 0.05;

        private _editorSupport: SpineEditorSupport;
        public dataKey: string;
        public atlasKey: string;
        public bpType: BoundsProviderType;
        public bpSkin: BoundsProviderSkin;
        public bpAnimation: string;
        public bpTimeStep: number;
        public animationMixes: IAnimationMixes;

        constructor(scene: Scene, x: number, y: number, dataKey: string, atlasKey: string) {
            super(scene, scene.spine, x, y, dataKey, atlasKey);

            this.dataKey = dataKey;
            this.atlasKey = atlasKey;
            this.bpType = BoundsProviderType.SETUP_TYPE;
            this.bpSkin = BoundsProviderSkin.CURRENT_SKIN;
            this.bpAnimation = null;
            this.bpTimeStep = SpineObject.DEFAULT_BP_TIME_STEP;

            this._editorSupport = new SpineEditorSupport(this, scene);
        }

        get timeScale() {

            return this.animationState.timeScale;
        }

        set timeScale(timeScale: number) {

            this.animationState.timeScale = timeScale;
        }

        get defaultMix() {

            return this.animationStateData.defaultMix;
        }

        set defaultMix(defaultMix: number) {

            this.animationStateData.defaultMix = defaultMix;
        }

        updateBoundsProvider() {

            if (this.bpType === BoundsProviderType.SETUP_TYPE) {

                this.boundsProvider = new spine.SetupPoseBoundsProvider();
                this.updateSize();

            } else {

                try {

                    let skins: string[] = [];

                    if (this.bpSkin === BoundsProviderSkin.CURRENT_SKIN) {

                        if (this.skeleton.skin) {

                            skins = [this.skeleton.skin.name];
                        }

                    } else {

                        skins = this.skeleton.data.skins.map(s => s.name);
                    }

                    // TODO: missing timeStep argument

                    this.boundsProvider = new spine.SkinsAndAnimationBoundsProvider(
                        this.bpAnimation, skins, this.bpTimeStep);

                    this.updateSize();

                } catch (e) {

                    console.error(e);

                    alert(e.message);
                }
            }

            this.setInteractive();
        }

        getEditorSupport() {

            return this._editorSupport;
        }
    }
}