/// <reference path="./BaseHitAreaComponent.ts" />
namespace phasereditor2d.scene.ui.sceneobjects {

    export class RectangleHitAreaComponent extends BaseHitAreaComponent {

        static x = HitAreaProperty(RectangleHitAreaComponent, "x", "X", "phaser:Phaser.Geom.Rectangle.x", 0);
        static y = HitAreaProperty(RectangleHitAreaComponent, "y", "Y", "phaser:Phaser.Geom.Rectangle.y", 0);
        static width = HitAreaProperty(RectangleHitAreaComponent, "width", "W", "phaser:Phaser.Geom.Rectangle.width", 0);
        static height = HitAreaProperty(RectangleHitAreaComponent, "height", "H", "phaser:Phaser.Geom.Rectangle.height", 0);
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
            super(obj, HitAreaShape.RECTANGLE, [
                RectangleHitAreaComponent.x,
                RectangleHitAreaComponent.y,
                RectangleHitAreaComponent.width,
                RectangleHitAreaComponent.height,
            ]);
        }

        static getRectangleComponent(obj: ISceneGameObject) {

            const objES = obj.getEditorSupport();

            const comp = objES.getComponent(RectangleHitAreaComponent) as RectangleHitAreaComponent;

            return comp;
        }

        protected _setDefaultValues(x:number, y: number, width: number, height: number): void {

            this.x = x;
            this.y = y;
            this.width = width;
            this.height = height;
        }

        protected override buildSetInteractiveCodeCOM(
            args: ISetObjectPropertiesCodeDOMArgs,
            obj: ISceneGameObject,
            code: core.code.MethodCallCodeDOM): void {

            const { x, y, width, height } = this;

            code.arg(`new Phaser.Geom.Rectangle(${x}, ${y}, ${width}, ${height})`);

            code.arg("Phaser.Geom.Rectangle.Contains");
        }
    }
}