namespace phasereditor2d.scene.ui.sceneobjects {

    import code = scene.core.code;

    export class ScriptNodeCodeDOMBuilder extends GameObjectCodeDOMBuilder {

        constructor() {
            super("ScriptNode");
        }

        buildCreateObjectWithFactoryCodeDOM(args: IBuildObjectFactoryCodeDOMArgs): core.code.MethodCallCodeDOM {

            const call = new code.MethodCallCodeDOM("ScriptNode");

            call.setConstructor(true);

            call.arg(args.parentVarName || args.sceneExpr)

            return call;
        }

        buildCreatePrefabInstanceCodeDOM(args: IBuildPrefabConstructorCodeDOMArgs): void {

            const call = args.methodCallDOM;

            call.arg(args.parentVarName || args.sceneExpr);
        }

        buildPrefabConstructorDeclarationCodeDOM(args: IBuildPrefabConstructorDeclarationCodeDOM): void {

            const decl = args.ctrDeclCodeDOM;

            // remove the scene arg
            decl.getArgs().pop();

            decl.arg("parent", "ScriptNode | Phaser.GameObjects.GameObject | Phaser.Scene", true);
        }

        buildPrefabConstructorDeclarationSupperCallCodeDOM(args: IBuildPrefabConstructorDeclarationSupperCallCodeDOMArgs): void {

            const call = args.superMethodCallCodeDOM;

            // remove the scene arg
            call.getArgs().pop();

            call.arg("parent");
        }
    }
}