/// <reference path="./BaseHitAreaComponent.ts" />
/// <reference path="./HitAreaProperty.ts" />
namespace phasereditor2d.scene.ui.sceneobjects {

    export class PolygonHitAreaComponent extends BaseHitAreaComponent {

        static points = HitAreaProperty(PolygonHitAreaComponent, "points", "Points", "The polygon's points, in a string format `X1 Y1 Y2 X2...`", "");
        
        public points: string;

        constructor(obj: ISceneGameObject) {
            super(obj, HitAreaShape.POLYGON, [
                PolygonHitAreaComponent.points
            ]);

            this.points = "";
        }

        get vectors() {

            const vectors: Phaser.Math.Vector2[] = [];

            const chunks = this.points.split(" ").map(s => s.trim()).filter(s => s.length > 0);

            for (let i = 0; i < chunks.length - 1; i += 2) {

                const x = Number.parseFloat(chunks[i]);
                const y = Number.parseFloat(chunks[i + 1]);

                vectors.push(new Phaser.Math.Vector2(x, y))
            }

            return vectors;
        }

        static getPolygonComponent(obj: ISceneGameObject) {

            const objES = obj.getEditorSupport();

            const comp = objES.getComponent(PolygonHitAreaComponent) as PolygonHitAreaComponent;

            return comp;
        }

        protected _setDefaultValues(w: number, h: number): void {

            this.points = `0 ${h * 0.25} ${w/2} 0 ${w} ${h * 0.25} ${w} ${h} 0 ${h}`;
        }

        protected override buildSetInteractiveCodeCOM(obj: ISceneGameObject, code: core.code.MethodCallCodeDOM): void {

            code.arg(`new Phaser.Geom.Polygon("${this.points}")`);

            code.arg("Phaser.Geom.Polygon.Contains");
        }
    }
}