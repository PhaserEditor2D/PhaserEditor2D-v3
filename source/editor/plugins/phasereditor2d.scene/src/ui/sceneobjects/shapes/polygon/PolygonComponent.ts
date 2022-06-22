namespace phasereditor2d.scene.ui.sceneobjects {

    export class PolygonComponent extends Component<Polygon> {

        static points = SimpleProperty("points", Polygon.DEFAULT_POINTS, "Points", "phaser:Phaser.Geom.Polygon.points");

        constructor(obj: Polygon) {
            super(obj,
                [PolygonComponent.points]);
        }

        buildSetObjectPropertiesCodeDOM(args: ISetObjectPropertiesCodeDOMArgs) {

            const obj = this.getObject();
            const support = obj.getEditorSupport();

            if (support.isNestedPrefabInstance()
                && support.isUnlockedProperty(PolygonComponent.points)) {

                const dom = new core.code.MethodCallCodeDOM("setTo", args.objectVarName);
                dom.argLiteral(obj.points);
                args.statements.push(dom);
            }
        }
    }
}