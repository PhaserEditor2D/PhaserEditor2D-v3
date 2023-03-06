namespace phasereditor2d.scene.ui.sceneobjects {

    import code = scene.core.code;

    export class ScriptNodeCodeDOMBuilder extends GameObjectCodeDOMBuilder {

        constructor() {
            super("script");
        }

        buildCreateObjectWithFactoryCodeDOM(args: IBuildObjectFactoryCodeDOMArgs): core.code.MethodCallCodeDOM {
            
            const call = new code.MethodCallCodeDOM("script", args.gameObjectFactoryExpr);

            return call;
        }

        buildCreatePrefabInstanceCodeDOM(args: IBuildPrefabConstructorCodeDOMArgs): void {

            const call = args.methodCallDOM;

            call.arg(args.sceneExpr);
        }

        buildPrefabConstructorDeclarationCodeDOM(args: IBuildPrefabConstructorDeclarationCodeDOM): void {

            args.ctrDeclCodeDOM.arg("parent", "ScriptNode | Phaser.GameObjects.GameObject", true);
        }

        buildPrefabConstructorDeclarationSupperCallCodeDOM(args: IBuildPrefabConstructorDeclarationSupperCallCodeDOMArgs): void {

            args.superMethodCallCodeDOM.arg("parent");
        }
    }
}