namespace phasereditor2d.scene.ui.sceneobjects {

    import code = core.code;

    export class TextCodeDOMBuilder extends ObjectCodeDOMBuilder {

        buildCreateObjectWithFactoryCodeDOM(args: IBuildObjectFactoryCodeDOMArgs): code.MethodCallCodeDOM {

            const call = new code.MethodCallCodeDOM("text", args.gameObjectFactoryExpr);

            this.addArgsToObjectFactoryMethodCallDOM(call, args.obj as Text);

            return call;
        }

        protected addArgsToObjectFactoryMethodCallDOM(call: code.MethodCallCodeDOM, obj: Text) {

            call.argFloat(obj.x);
            call.argFloat(obj.y);
            call.argLiteral(obj.text);

            this.addTextStyleArgsToObjectFactoryMethodCallDOM(call, obj);
        }

        private addTextStyleArgsToObjectFactoryMethodCallDOM(call: code.MethodCallCodeDOM, obj: ITransformLikeObject) {

            call.arg("{}");
        }

        buildCreatePrefabInstanceCodeDOM(args: IBuildPrefabConstructorCodeDOMArgs) {

            const call = args.methodCallDOM;

            call.arg(args.sceneExpr);

            this.addArgsToObjectFactoryMethodCallDOM(call, args.obj as Text);
        }

        buildPrefabConstructorDeclarationSupperCallCodeDOM(
            args: IBuildPrefabConstructorDeclarationSupperCallCodeDOMArgs): void {

            const call = args.superMethodCallCodeDOM;

            call.arg("x");
            call.arg("y");
            call.arg("text");
            call.arg("style");
        }

        buildPrefabConstructorDeclarationCodeDOM(args: IBuildPrefabConstructorDeclarationCodeDOM): void {

            const ctr = args.ctrDeclCodeDOM;

            ctr.addArg("x", "number");
            ctr.addArg("y", "number");
            ctr.addArg("text", "string");
            ctr.addArg("style", "Phaser.Types.GameObjects.Text.TextStyle");
        }
    }
}