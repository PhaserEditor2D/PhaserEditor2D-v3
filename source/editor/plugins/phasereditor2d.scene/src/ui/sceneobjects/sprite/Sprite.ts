namespace phasereditor2d.scene.ui.sceneobjects {

    export enum PlayMethod {
        NONE = 0,
        PLAY = 1,
        PLAY_REVERSE = 2
    }

    export class Sprite extends Phaser.GameObjects.Image implements ISceneGameObject {

        private _editorSupport: SpriteEditorSupport;

        public playMethod: PlayMethod = PlayMethod.NONE;
        public playAnimation = "";

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