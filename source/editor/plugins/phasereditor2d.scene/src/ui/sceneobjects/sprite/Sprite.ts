namespace phasereditor2d.scene.ui.sceneobjects {

    export enum AnimationPlayMethod {
        NONE = 0,
        PLAY = 1,
        PLAY_REVERSE = 2
    }

    export class Sprite extends Phaser.GameObjects.Image implements ISceneGameObject {

        private _editorSupport: SpriteEditorSupport;

        public animationPlayMethod: AnimationPlayMethod = AnimationPlayMethod.NONE;
        public animationKey = "";
        public animationCustomConfig = false;
        public animationFrameRate = 24;
        public animationDelay = 0;
        public animationRepeat = 0;
        public animationRepeatDelay = 0;
        public animationYoyo = false;
        public animationShowBeforeDelay = false;
        public animationShowOnStart = false;
        public animationHideOnComplete = false;
        public animationStartFrame = 0;
        public animationTimeScale = 1;

        constructor(
            scene: Scene, x: number, y: number, texture: string, frame?: string | number) {

            super(scene, x, y, texture, frame);

            this._editorSupport = new SpriteEditorSupport(this, scene);
        }

        getEditorSupport(): SpriteEditorSupport {

            return this._editorSupport;
        }
    }
}