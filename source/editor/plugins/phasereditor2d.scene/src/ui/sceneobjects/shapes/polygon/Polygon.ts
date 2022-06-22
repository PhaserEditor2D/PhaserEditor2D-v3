namespace phasereditor2d.scene.ui.sceneobjects {

    export class Polygon extends Phaser.GameObjects.Polygon implements ISceneGameObject {

        static DEFAULT_POINTS = [
            -35 + 70, 50 + 50,
            -70 + 70, 0 + 50,
            0 + 70, -50 + 50,
            70 + 70, 0 + 50,
            35 + 70, 50 + 50
        ].join(" ");

        private _editorSupport: PolygonEditorSupport;

        constructor(scene: Scene, x: number, y: number, points: string) {
            super(scene, x, y, points);

            this._editorSupport = new PolygonEditorSupport(scene, this);
        }

        getEditorSupport() {

            return this._editorSupport;
        }

        getPointsString() {

            return this.getPolygonGeom().points.map(p => `${p.x} ${p.y}`).join(" ");
        }

        get points() {

            if (this.getPolygonGeom()) {

                return this.getPolygonGeom().points.map(p => `${p.x} ${p.y}`).join(" ");
            }

            return "";
        }

        set points(points: string) {

            this.getPolygonGeom().setTo(points);

            var bounds = Phaser.Geom.Polygon.GetAABB(this.geom);

            (this as any).setSize(bounds.width, bounds.height);

            this.updateDisplayOrigin();

            (this as any).updateData();

            this.updateDisplayOrigin();
        }

        getPolygonGeom() {

            return this.geom as Phaser.Geom.Polygon;
        }
    }
}