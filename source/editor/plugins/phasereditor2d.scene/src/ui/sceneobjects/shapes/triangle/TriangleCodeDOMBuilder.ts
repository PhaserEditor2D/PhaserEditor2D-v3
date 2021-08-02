namespace phasereditor2d.scene.ui.sceneobjects {

    import code = core.code;

    export class TriangleCodeDOMBuilder extends BaseImageCodeDOMBuilder {

        constructor() {
            super("triangle");
        }

        buildCreatePrefabInstanceCodeDOM(args: IBuildPrefabConstructorCodeDOMArgs) {

            const obj = args.obj as Triangle;
            const support = obj.getEditorSupport();
            const call = args.methodCallDOM;

            call.arg(args.sceneExpr);

            this.buildCreatePrefabInstanceCodeDOM_XY_Arguments(args);

            for (const p of [TriangleComponent.p1, TriangleComponent.p2, TriangleComponent.p3]) {

                if (support.isUnlockedPropertyXY(p)) {

                    call.argFloat(p.x.getValue(obj));
                    call.argFloat(p.y.getValue(obj));

                } else {

                    call.arg("undefined");
                    call.arg("undefined");
                }
            }
        }

        buildPrefabConstructorDeclarationCodeDOM(args: IBuildPrefabConstructorDeclarationCodeDOM): void {

            const ctr = args.ctrDeclCodeDOM;

            ctr.arg("x", "number", true);
            ctr.arg("y", "number", true);
            ctr.arg("x1", "number", true);
            ctr.arg("y1", "number", true);
            ctr.arg("x2", "number", true);
            ctr.arg("y2", "number", true);
            ctr.arg("x3", "number", true);
            ctr.arg("y3", "number", true);
        }

        buildPrefabConstructorDeclarationSupperCallCodeDOM(
            args: IBuildPrefabConstructorDeclarationSupperCallCodeDOMArgs): void {

            const obj = args.prefabObj as Triangle;
            const support = obj.getEditorSupport();

            const call = args.superMethodCallCodeDOM;

            this.buildPrefabConstructorDeclarationSupperCallCodeDOM_XYParameters(args);

            for (const p of [TriangleComponent.p1, TriangleComponent.p2, TriangleComponent.p3]) {

                if (support.isUnlockedPropertyXY(p)) {

                    call.arg(`${p.x.name} ?? ${p.x.getValue(obj)}`);
                    call.arg(`${p.y.name} ?? ${p.y.getValue(obj)}`);

                } else {

                    call.arg("undefined");
                    call.arg("undefined");
                }
            }
        }

        buildCreateObjectWithFactoryCodeDOM(args: IBuildObjectFactoryCodeDOMArgs): code.MethodCallCodeDOM {

            const obj = args.obj as Triangle;
            const call = new code.MethodCallCodeDOM("triangle", args.gameObjectFactoryExpr);

            call.argFloat(obj.x);
            call.argFloat(obj.y);
            call.argFloat(obj.x1);
            call.argFloat(obj.y1);
            call.argFloat(obj.x2);
            call.argFloat(obj.y2);
            call.argFloat(obj.x3);
            call.argFloat(obj.y3);

            return call;
        }
    }
}