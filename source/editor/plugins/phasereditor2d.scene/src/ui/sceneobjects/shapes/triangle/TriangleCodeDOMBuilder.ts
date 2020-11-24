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
            call.argFloat(obj.x);
            call.argFloat(obj.y);

            if (support.isUnlockedProperty(SizeComponent.width)) {

                call.argFloat(obj.x1);
                call.argFloat(obj.y1);
                call.argFloat(obj.x2);
                call.argFloat(obj.y2);
                call.argFloat(obj.x3);
                call.argFloat(obj.y3);

            } else {

                call.arg("undefined");
                call.arg("undefined");
                call.arg("undefined");
                call.arg("undefined");
                call.arg("undefined");
                call.arg("undefined");
            }
        }

        buildPrefabConstructorDeclarationCodeDOM(args: IBuildPrefabConstructorDeclarationCodeDOM): void {

            const ctr = args.ctrDeclCodeDOM;

            ctr.arg("x", "number");
            ctr.arg("y", "number");
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

            call.arg("x");
            call.arg("y");

            if (support.isUnlockedProperty(SizeComponent.width)) {

                call.arg("typeof x1 === \"number\" ? x1 : " + obj.x1);
                call.arg("typeof y1 === \"number\" ? y1 : " + obj.y1);
                call.arg("typeof x2 === \"number\" ? x2 : " + obj.x2);
                call.arg("typeof y2 === \"number\" ? y2 : " + obj.y2);
                call.arg("typeof x3 === \"number\" ? x3 : " + obj.x3);
                call.arg("typeof y3 === \"number\" ? y3 : " + obj.y3);

            } else {

                call.arg("x1");
                call.arg("y1");
                call.arg("x2");
                call.arg("y2");
                call.arg("x3");
                call.arg("y3");
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