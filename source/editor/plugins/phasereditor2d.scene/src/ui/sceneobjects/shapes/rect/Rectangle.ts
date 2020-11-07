namespace phasereditor2d.scene.ui.sceneobjects {

    export class Rectangle extends Phaser.GameObjects.Rectangle implements ISceneGameObject {

        private _editorSupport: RectangleEditorSupport;

        constructor(scene: Scene, x: number, y: number) {
            super(scene, x, y);

            this._editorSupport = new RectangleEditorSupport(scene, this);
        }

        getEditorSupport() {

            return this._editorSupport;
        }

        setSize(width: number, height: number) {

            super.setSize(width, height);

            const geom = this.geom as Phaser.Geom.Rectangle;

            geom.setSize(width, height);

            this.updateDisplayOrigin();

            const self = this as any;

            self.updateData();

            return this;
        }
    }
}