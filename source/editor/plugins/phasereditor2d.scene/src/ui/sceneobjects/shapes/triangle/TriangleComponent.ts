namespace phasereditor2d.scene.ui.sceneobjects {

    export class TriangleComponent extends Component<Triangle> {

        static x1 = SimpleProperty("x1", 0, "X", "phaser:Phaser.Geom.Triangle.x1");
        static y1 = SimpleProperty("y1", 128, "Y", "phaser:Phaser.Geom.Triangle.y1");
        static x2 = SimpleProperty("x2", 64, "X", "phaser:Phaser.Geom.Triangle.x2");
        static y2 = SimpleProperty("y2", 0, "Y", "phaser:Phaser.Geom.Triangle.y2");
        static x3 = SimpleProperty("x3", 128, "X", "phaser:Phaser.Geom.Triangle.x3");
        static y3 = SimpleProperty("y3", 128, "Y", "phaser:Phaser.Geom.Triangle.y3");

        static p1: IPropertyXY = {
            label: "Point 1",
            x: TriangleComponent.x1,
            y: TriangleComponent.y1
        };

        static p2: IPropertyXY = {
            label: "Point 2",
            x: TriangleComponent.x2,
            y: TriangleComponent.y2
        };

        static p3: IPropertyXY = {
            label: "Point 3",
            x: TriangleComponent.x3,
            y: TriangleComponent.y3
        };

        constructor(obj: Triangle) {
            super(obj,
                [TriangleComponent.x1,
                TriangleComponent.y1,
                TriangleComponent.x2,
                TriangleComponent.y2,
                TriangleComponent.x3,
                TriangleComponent.y3])
        }

        buildSetObjectPropertiesCodeDOM(args: ISetObjectPropertiesCodeDOMArgs) {

            // nothing
        }
    }
}