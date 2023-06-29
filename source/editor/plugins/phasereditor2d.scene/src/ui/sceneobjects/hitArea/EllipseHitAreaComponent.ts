/// <reference path="./BaseHitAreaComponent.ts" />
/// <reference path="./HitAreaProperty.ts" />
namespace phasereditor2d.scene.ui.sceneobjects {

    export class EllipseHitAreaComponent extends BaseHitAreaComponent {

        static x = HitAreaProperty(EllipseHitAreaComponent, "x", "X", "phaser:Phaser.Geom.Ellipse.x", 0);
        static y = HitAreaProperty(EllipseHitAreaComponent, "y", "Y", "phaser:Phaser.Geom.Ellipse.y", 0);
        static width = HitAreaProperty(EllipseHitAreaComponent, "width", "W", "phaser:Phaser.Geom.Ellipse.width", 0);
        static height = HitAreaProperty(EllipseHitAreaComponent, "height", "H", "phaser:Phaser.Geom.Ellipse.height", 0);

        static position: IPropertyXY = {
            label: "Offset",
            x: this.x,
            y: this.y
        };

        static size: IPropertyXY = {
            label: "Size",
            x: this.width,
            y: this.height
        };

        public x = 0;
        public y = 0;
        public width = 0;
        public height = 0;

        constructor(obj: ISceneGameObject) {
            super(obj, HitAreaShape.ELLIPSE, [
                EllipseHitAreaComponent.x,
                EllipseHitAreaComponent.y,
                EllipseHitAreaComponent.width,
                EllipseHitAreaComponent.height,
            ]);
        }

        static getEllipseComponent(obj: ISceneGameObject) {

            const objES = obj.getEditorSupport();

            const comp = objES.getComponent(EllipseHitAreaComponent) as EllipseHitAreaComponent;

            return comp;
        }

        protected _setDefaultValues(x: number, y: number, width: number, height: number): void {

            this.x = x + width / 2;
            this.y = y + height / 2;
            this.width = width;
            this.height = height;
        }

        protected override buildSetInteractiveCodeCOM(
            args: ISetObjectPropertiesCodeDOMArgs,
            obj: ISceneGameObject,
            code: core.code.MethodCallCodeDOM): void {

            const { x, y, width, height } = this;

            code.arg(`new Phaser.Geom.Ellipse(${x}, ${y}, ${width}, ${height})`);

            code.arg("Phaser.Geom.Ellipse.Contains");
        }
    }
}