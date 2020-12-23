namespace phasereditor2d.scene.ui.sceneobjects {

    import code = core.code;

    export class LayerCodeDOMBuilder extends GameObjectCodeDOMBuilder {

        private static _instance = new LayerCodeDOMBuilder();

        static getInstance() {
            return this._instance;
        }

        buildPrefabConstructorDeclarationSupperCallCodeDOM(
            args: IBuildPrefabConstructorDeclarationSupperCallCodeDOMArgs): void {

            // nothing
        }

        buildPrefabConstructorDeclarationCodeDOM(args: IBuildPrefabConstructorDeclarationCodeDOM): void {
            // nothing
        }

        buildCreatePrefabInstanceCodeDOM(args: IBuildPrefabConstructorCodeDOMArgs) {

            const call = args.methodCallDOM;
            call.arg(args.sceneExpr);
        }

        buildCreateObjectWithFactoryCodeDOM(args: IBuildObjectFactoryCodeDOMArgs): code.MethodCallCodeDOM {

            const call = new code.MethodCallCodeDOM("layer", args.gameObjectFactoryExpr);

            return call;
        }
    }
}