namespace phasereditor2d.scene.ui.sceneobjects {

    import code = core.code;

    export class PolygonCodeDOMBuilder extends BaseImageCodeDOMBuilder {

        constructor() {
            super("polygon");
        }

        buildCreatePrefabInstanceCodeDOM(args: IBuildPrefabConstructorCodeDOMArgs) {

            const obj = args.obj as Triangle;
            const support = obj.getEditorSupport();
            const call = args.methodCallDOM;

            call.arg(args.sceneExpr);

            this.buildCreatePrefabInstanceCodeDOM_XY_Arguments(args);

            if (support.isUnlockedProperty(PolygonComponent.points)) {

                call.argLiteral(PolygonComponent.points.getValue(obj));

            } else {

                call.arg("undefined");
            }
        }

        buildPrefabConstructorDeclarationCodeDOM(args: IBuildPrefabConstructorDeclarationCodeDOM): void {

            const ctr = args.ctrDeclCodeDOM;

            ctr.arg("x", "number", true);
            ctr.arg("y", "number", true);
            ctr.arg("points", "string", true);
        }

        buildPrefabConstructorDeclarationSupperCallCodeDOM(
            args: IBuildPrefabConstructorDeclarationSupperCallCodeDOMArgs): void {

            const obj = args.prefabObj as Triangle;
            const support = obj.getEditorSupport();

            const call = args.superMethodCallCodeDOM;

            this.buildPrefabConstructorDeclarationSupperCallCodeDOM_XYParameters(args);

            const p = PolygonComponent.points;

            if (support.isUnlockedProperty(p)) {

                call.arg(`${p.name} ?? "${p.getValue(obj)}"`);

            } else {

                call.arg("undefined");
            }
        }

        buildCreateObjectWithFactoryCodeDOM(args: IBuildObjectFactoryCodeDOMArgs): code.MethodCallCodeDOM {

            const obj = args.obj as Triangle;
            const call = new code.MethodCallCodeDOM("polygon", args.gameObjectFactoryExpr);

            call.argFloat(obj.x);
            call.argFloat(obj.y);
            call.argLiteral(PolygonComponent.points.getValue(obj));

            return call;
        }
    }
}