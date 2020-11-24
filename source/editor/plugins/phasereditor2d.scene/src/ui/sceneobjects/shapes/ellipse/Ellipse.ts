namespace phasereditor2d.scene.ui.sceneobjects {

    export class Ellipse extends Phaser.GameObjects.Ellipse implements ISceneGameObject {

        private _editorSupport: EllipseEditorSupport;

        constructor(scene: Scene, x: number, y: number) {
            super(scene, x, y);

            this._editorSupport = new EllipseEditorSupport(scene, this);
        }

        getEditorSupport() {

            return this._editorSupport;
        }

        setSize(width: number, height: number) {

            const self = this as any;

            const geom = this.geom as Phaser.Geom.Ellipse;

            geom.setPosition(width / 2, height / 2);
            geom.setSize(width, height);

            this.width = width;
            this.height = height;

            this.updateDisplayOrigin();

            self.updateData();

            return this;
        }
    }
}