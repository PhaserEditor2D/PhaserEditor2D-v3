namespace phasereditor2d.scene.ui.sceneobjects {

    export class PolygonComponent extends Component<Polygon> {

        static points = SimpleProperty("points", Polygon.DEFAULT_POINTS, "Points", "phaser:Phaser.Geom.Polygon.points");

        constructor(obj: Polygon) {
            super(obj,
                [PolygonComponent.points]);
        }

        buildSetObjectPropertiesCodeDOM(args: ISetObjectPropertiesCodeDOMArgs) {

            // TODO!!!!!! Missing to implement the setTo(..) method.
            // check this issue: https://github.com/photonstorm/phaser/issues/6151

            // const obj = this.getObject();
            // const support = obj.getEditorSupport();

            // if (support.isNestedPrefabInstance() &&
            //     (support.isUnlockedPropertyXY(TriangleComponent.p1)
            //         || support.isUnlockedPropertyXY(TriangleComponent.p2)
            //         || support.isUnlockedPropertyXY(TriangleComponent.p3))) {

            //     const dom = new core.code.MethodCallCodeDOM("setTo", args.objectVarName);
            //     dom.argFloat(obj.x1);
            //     dom.argFloat(obj.y1);
            //     dom.argFloat(obj.x2);
            //     dom.argFloat(obj.y2);
            //     dom.argFloat(obj.x3);
            //     dom.argFloat(obj.y3);
            //     args.statements.push(dom);
            // }
        }
    }
}