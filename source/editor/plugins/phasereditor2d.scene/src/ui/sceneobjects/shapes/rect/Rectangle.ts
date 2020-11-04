namespace phasereditor2d.scene.ui.sceneobjects {

    export class Rectangle extends Phaser.GameObjects.Rectangle implements ISceneGameObject {

        private _editorSupport: RectangleEditorSupport;

        constructor(scene: Scene, x: number, y: number) {
            super(scene, x, y);

            this._editorSupport = new RectangleEditorSupport(scene, this);
        }

        getEditorSupport(): GameObjectEditorSupport<ISceneGameObject> {

            return this._editorSupport;
        }
    }
}