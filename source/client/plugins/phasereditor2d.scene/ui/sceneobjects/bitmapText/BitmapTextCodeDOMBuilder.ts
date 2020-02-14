namespace phasereditor2d.scene.ui.sceneobjects {

    import code = core.code;

    export class BitmapTextCodeDOMBuilder extends ObjectCodeDOMBuilder {

        buildCreateObjectWithFactoryCodeDOM(args: IBuildObjectFactoryCodeDOMArgs): code.MethodCallCodeDOM {

            const call = new code.MethodCallCodeDOM("bitmapText", args.gameObjectFactoryExpr);

            this.addArgsToObjectFactoryMethodCallDOM(call, args.obj as BitmapText);

            return call;
        }

        protected addArgsToObjectFactoryMethodCallDOM(call: code.MethodCallCodeDOM, obj: BitmapText) {

            call.argFloat(obj.x);
            call.argFloat(obj.y);
            call.argLiteral(obj.font);
            call.argLiteral(obj.text);
        }

        buildCreatePrefabInstanceCodeDOM(args: IBuildPrefabConstructorCodeDOMArgs): void {

            const call = args.methodCallDOM;

            call.arg(args.sceneExpr);

            this.addArgsToObjectFactoryMethodCallDOM(call, args.obj as BitmapText);
        }

        buildPrefabConstructorDeclarationCodeDOM(args: IBuildPrefabConstructorDeclarationCodeDOM): void {

            const ctr = args.ctrDeclCodeDOM;

            ctr.arg("x", "number");
            ctr.arg("y", "number");
            ctr.arg("font", "string");
            ctr.arg("text", "string");
        }

        buildPrefabConstructorDeclarationSupperCallCodeDOM(
            args: IBuildPrefabConstructorDeclarationSupperCallCodeDOMArgs): void {

            const call = args.superMethodCallCodeDOM;

            call.arg("x");
            call.arg("y");
            call.arg("font");
            call.arg("text");
        }
    }
}