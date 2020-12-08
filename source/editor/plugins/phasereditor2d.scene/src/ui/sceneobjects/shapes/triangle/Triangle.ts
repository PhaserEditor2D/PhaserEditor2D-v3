namespace phasereditor2d.scene.ui.sceneobjects {

    export class Triangle extends Phaser.GameObjects.Triangle implements ISceneGameObject {

        private _editorSupport: TriangleEditorSupport;
        private _triangle: Phaser.Geom.Triangle;

        constructor(scene: Scene, x: number, y: number) {
            super(scene, x, y);

            this._editorSupport = new TriangleEditorSupport(scene, this);

            this._triangle = this.geom;
        }

        getTriangleGeom() {

            return this._triangle;
        }

        get x1() {

            return this.getTriangleGeom().x1;
        }

        set x1(val: number) {

            this.setTo(val, this.y1, this.x2, this.y2, this.x3, this.y3);
        }

        get x2() {

            return this.getTriangleGeom().x2;
        }

        set x2(val: number) {

            this.setTo(this.x1, this.y1, val, this.y2, this.x3, this.y3);
        }

        get x3() {

            return this.getTriangleGeom().x3;
        }

        set x3(val: number) {

            this.setTo(this.x1, this.y1, this.x2, this.y2, val, this.y3);
        }

        get y1() {

            return this.getTriangleGeom().y1;
        }

        set y1(val: number) {

            this.setTo(this.x1, val, this.x2, this.y2, this.x3, this.y3);
        }

        get y2() {

            return this.getTriangleGeom().y2;
        }

        set y2(val: number) {

            this.setTo(this.x1, this.y1, this.x2, val, this.x3, this.y3);
        }

        get y3() {

            return this.getTriangleGeom().y3;
        }

        set y3(val: number) {

            this.setTo(this.x1, this.y1, this.x2, this.y2, this.x3, val);
        }

        setTo(x1?: number, y1?: number, x2?: number, y2?: number, x3?: number, y3?: number) {

            super.setTo(x1, y1, x2, y2, x3, y3);

            const geom = this.getTriangleGeom();

            const width = geom.right - geom.left;
            const height = geom.bottom - geom.top;

            this["setSize"](width, height);

            this.updateDisplayOrigin();

            return this;
        }

        getEditorSupport() {

            return this._editorSupport;
        }
    }
}