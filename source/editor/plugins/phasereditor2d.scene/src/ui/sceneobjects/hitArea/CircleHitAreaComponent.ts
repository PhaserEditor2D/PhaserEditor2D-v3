/// <reference path="./BaseHitAreaComponent.ts" />
/// <reference path="./HitAreaProperty.ts" />
namespace phasereditor2d.scene.ui.sceneobjects {

    export class CircleHitAreaComponent extends BaseHitAreaComponent {

        static x = HitAreaProperty(CircleHitAreaComponent, "x", "X", "phaser:Phaser.Geom.Circle.x", 0);
        static y = HitAreaProperty(CircleHitAreaComponent, "y", "Y", "phaser:Phaser.Geom.Circle.y", 0);
        static radius = HitAreaProperty(CircleHitAreaComponent, "radius", "Radius", "phaser:Phaser.Geom.Circle.radius", 0);
        
        static position: IPropertyXY = {
            label: "Offset",
            x: this.x,
            y: this.y
        };

        public x = 0;
        public y = 0;
        public radius = 0;

        constructor(obj: ISceneGameObject) {
            super(obj, HitAreaShape.CIRCLE, [
                CircleHitAreaComponent.x,
                CircleHitAreaComponent.y,
                CircleHitAreaComponent.radius,
            ]);
        }

        static getCircleComponent(obj: ISceneGameObject) {

            const objES = obj.getEditorSupport();

            const comp = objES.getComponent(CircleHitAreaComponent) as CircleHitAreaComponent;

            return comp;
        }

        protected _setDefaultValues(x:number, y: number, width: number, height: number): void {

            this.x = x + width / 2;
            this.y = y + height / 2;
            this.radius = Math.min(width, height) / 2;
        }

        protected override buildSetInteractiveCodeCOM(
            args: ISetObjectPropertiesCodeDOMArgs,
            obj: ISceneGameObject,
            code: core.code.MethodCallCodeDOM): void {

            const { x, y, radius } = this;

            code.arg(`new Phaser.Geom.Circle(${x}, ${y}, ${radius})`);

            code.arg("Phaser.Geom.Circle.Contains");
        }
    }
}