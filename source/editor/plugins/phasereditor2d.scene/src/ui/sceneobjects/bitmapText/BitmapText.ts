namespace phasereditor2d.scene.ui.sceneobjects {

    export class BitmapText extends Phaser.GameObjects.BitmapText implements ISceneGameObject {

        private _editorSupport: BitmapTextEditorSupport;

        constructor(scene: Scene, x: number, y: number, font: string, text: string | string[]) {
            super(scene, x, y, font, "New BitmapText");

            this._editorSupport = new BitmapTextEditorSupport(this, scene);
        }

        getEditorSupport(): BitmapTextEditorSupport {

            return this._editorSupport;
        }
    }
}