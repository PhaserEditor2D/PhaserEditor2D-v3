namespace phasereditor2d.scene.ui.sceneobjects {

    import code = core.code;

    export class ContainerCodeDOMBuilder extends ObjectCodeDOMBuilder {

        private static _instance = new ContainerCodeDOMBuilder();

        static getInstance() {
            return this._instance;
        }

        buildPrefabConstructorDeclarationSupperCallCodeDOM(
            args: BuildPrefabConstructorDeclarationSupperCallCodeDOMArgs): void {

            const call = args.superMethodCallCodeDOM;

            call.arg("x");
            call.arg("y");
        }

        buildPrefabConstructorDeclarationCodeDOM(args: BuildPrefabConstructorDeclarationCodeDOM): void {

            const ctr = args.ctrDeclCodeDOM;

            ctr.addArg("x", "number");
            ctr.addArg("y", "number");
        }

        buildCreatePrefabInstanceCodeDOM(args: BuildPrefabConstructorCodeDOMArgs) {

            const obj = args.obj as Container;
            const call = args.methodCallDOM;

            call.arg(args.sceneExpr);
            call.argFloat(obj.x);
            call.argFloat(obj.y);
        }

        buildCreateObjectWithFactoryCodeDOM(args: BuildObjectFactoryCodeDOMArgs): code.MethodCallCodeDOM {

            const obj = args.obj as Container;
            const call = new code.MethodCallCodeDOM("container", args.gameObjectFactoryExpr);

            call.argFloat(obj.x);
            call.argFloat(obj.y);

            return call;
        }
    }
}