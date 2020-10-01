namespace phasereditor2d.scene.ui.sceneobjects {

    export interface ITextContentLikeObject extends ISceneGameObject {

        text: string;
    }

    export class Text extends Phaser.GameObjects.Text implements ISceneGameObject {

        private _editorSupport: TextEditorSupport;

        constructor(
            scene: Scene, x: number, y: number, text: string, style: Phaser.Types.GameObjects.Text.TextStyle) {
            super(scene, x, y, text, style);

            this._editorSupport = new TextEditorSupport(this, scene);
        }

        getEditorSupport(): GameObjectEditorSupport<ISceneGameObject> {

            return this._editorSupport;
        }
    }
}