namespace phasereditor2d.scene.ui.sceneobjects {

    export class Text extends Phaser.GameObjects.Text implements ISceneObject {

        private _editorSupport: TextEditorSupport;

        constructor(
            scene: Scene, x: number, y: number, text: string, style: Phaser.Types.GameObjects.Text.TextStyle) {
            super(scene, x, y, text, style);

            this._editorSupport = new TextEditorSupport(this, scene);
        }

        getEditorSupport(): EditorSupport<ISceneObject> {

            return this._editorSupport;
        }
    }
}