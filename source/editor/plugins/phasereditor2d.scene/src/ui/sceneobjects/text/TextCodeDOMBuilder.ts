namespace phasereditor2d.scene.ui.sceneobjects {

    import code = core.code;

    export class TextCodeDOMBuilder extends GameObjectCodeDOMBuilder {

        buildCreateObjectWithFactoryCodeDOM(args: IBuildObjectFactoryCodeDOMArgs): code.MethodCallCodeDOM {

            const obj = args.obj as Text;
            const call = new code.MethodCallCodeDOM("text", args.gameObjectFactoryExpr);

            call.argFloat(obj.x);
            call.argFloat(obj.y);
            call.argLiteral("");
            call.arg("{}");

            return call;
        }

        buildCreatePrefabInstanceCodeDOM(args: IBuildPrefabConstructorCodeDOMArgs) {

            const call = args.methodCallDOM;

            call.arg(args.sceneExpr);

            this.buildCreatePrefabInstanceCodeDOM_XY_Arguments(args);
        }

        buildPrefabConstructorDeclarationSupperCallCodeDOM(
            args: IBuildPrefabConstructorDeclarationSupperCallCodeDOMArgs): void {

            this.buildPrefabConstructorDeclarationSupperCallCodeDOM_XYParameters(args);

            const call = args.superMethodCallCodeDOM;

            if (!args.prefabObj.getEditorSupport().isPrefabInstance()) {

                call.argLiteral("");
                call.arg("{}");
            }
        }

        buildPrefabConstructorDeclarationCodeDOM(args: IBuildPrefabConstructorDeclarationCodeDOM): void {

            const ctr = args.ctrDeclCodeDOM;

            ctr.arg("x", "number", true);
            ctr.arg("y", "number", true);
        }
    }
}