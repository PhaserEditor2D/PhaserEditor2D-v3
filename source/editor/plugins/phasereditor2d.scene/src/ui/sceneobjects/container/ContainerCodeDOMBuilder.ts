namespace phasereditor2d.scene.ui.sceneobjects {

    import code = core.code;

    export class ContainerCodeDOMBuilder extends GameObjectCodeDOMBuilder {

        private static _instance = new ContainerCodeDOMBuilder();

        static getInstance() {
            return this._instance;
        }

        buildPrefabConstructorDeclarationSupperCallCodeDOM(
            args: IBuildPrefabConstructorDeclarationSupperCallCodeDOMArgs): void {

            this.buildPrefabConstructorDeclarationSupperCallCodeDOM_XYParameters(args);
        }

        buildPrefabConstructorDeclarationCodeDOM(args: IBuildPrefabConstructorDeclarationCodeDOM): void {

            const ctr = args.ctrDeclCodeDOM;

            ctr.arg("x", "number", true);
            ctr.arg("y", "number", true);
        }

        buildCreatePrefabInstanceCodeDOM(args: IBuildPrefabConstructorCodeDOMArgs) {

            const call = args.methodCallDOM;

            call.arg(args.sceneExpr);

            this.buildCreatePrefabInstanceCodeDOM_XY_Arguments(args);
        }

        buildCreateObjectWithFactoryCodeDOM(args: IBuildObjectFactoryCodeDOMArgs): code.MethodCallCodeDOM {

            const obj = args.obj as Container;
            const call = new code.MethodCallCodeDOM("container", args.gameObjectFactoryExpr);

            call.argFloat(obj.x);
            call.argFloat(obj.y);

            return call;
        }
    }
}