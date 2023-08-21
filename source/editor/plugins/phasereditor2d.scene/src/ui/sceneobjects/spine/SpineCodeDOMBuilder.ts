namespace phasereditor2d.scene.ui.sceneobjects {

    import code = core.code;

    export class SpineCodeDOMBuilder extends GameObjectCodeDOMBuilder {

        buildCreateObjectWithFactoryCodeDOM(args: IBuildObjectFactoryCodeDOMArgs): core.code.MethodCallCodeDOM {

            const obj = args.obj as SpineObject;
            const call = new code.MethodCallCodeDOM("spine", args.gameObjectFactoryExpr);

            call.argFloat(obj.x);
            call.argFloat(obj.y);
            call.argLiteral(obj.dataKey);
            call.argLiteral(obj.atlasKey);

            return call;
        }

        buildCreatePrefabInstanceCodeDOM(args: IBuildPrefabConstructorCodeDOMArgs): void {

            const obj = args.obj as SpineObject;
            const { dataKey, atlasKey } = obj;

            const call = args.methodCallDOM;

            call.arg(args.sceneExpr);
            call.arg(`${args.sceneExpr}.spine`);

            this.buildCreatePrefabInstanceCodeDOM_XY_Arguments(args);

            call.argLiteral(dataKey);
            call.argLiteral(atlasKey);
        }

        buildPrefabConstructorDeclarationCodeDOM(args: IBuildPrefabConstructorDeclarationCodeDOM): void {

            args.unit.addImport("{ SpinePlugin }", "@esotericsoftware/spine-phaser");
            args.unit.addImport("{ SpineGameObject }", "@esotericsoftware/spine-phaser");
            args.importTypes.push("Phaser.Scene");

            const ctr = args.ctrDeclCodeDOM;

            ctr.arg("plugin", args.isESModule ? "SpinePlugin" : "spine.SpinePlugin");
            ctr.arg("x", "number");
            ctr.arg("y", "number");
            ctr.arg("dataKey", "string");
            ctr.arg("atlasKey", "string");
        }

        buildPrefabConstructorDeclarationSupperCallCodeDOM(
            args: IBuildPrefabConstructorDeclarationSupperCallCodeDOMArgs): void {

            const call = args.superMethodCallCodeDOM;

            call.arg("plugin");

            this.buildPrefabConstructorDeclarationSupperCallCodeDOM_XYParameters(args);

            call.arg("dataKey");
            call.arg("atlasKey");
        }
    }
}