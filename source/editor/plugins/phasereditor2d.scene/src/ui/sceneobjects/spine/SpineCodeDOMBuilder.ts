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

            if (obj.bpType !== SpineComponent.bpType.defValue) {

                const expr = SpineCodeDOMBuilder.generateNewBoundsProviderExpression(obj, args.unit);

                call.arg(expr)
            }

            return call;
        }

        buildCreatePrefabInstanceCodeDOM(args: IBuildPrefabConstructorCodeDOMArgs): void {

            const obj = args.obj as SpineObject;
            const objES = obj.getEditorSupport();

            const call = args.methodCallDOM;

            call.arg(args.sceneExpr);
            call.arg(`${args.sceneExpr}.spine`);

            this.buildCreatePrefabInstanceCodeDOM_XY_Arguments(args);

            // The dataKey and atlasKey can't be overriden in instances
            // so it uses those defined in the prefab class
            // call.argLiteral(dataKey);
            // call.argLiteral(atlasKey);

            if (objES.isUnlockedProperty(SpineComponent.bpType)) {

                const expr = SpineCodeDOMBuilder.generateNewBoundsProviderExpression(obj, args.unit);
                call.arg(expr);
            }
        }

        public static generateNewBoundsProviderExpression(obj: SpineObject, unit: code.UnitCodeDOM) {

            if (obj.bpType === BoundsProviderType.SETUP_TYPE) {

                unit.addImport("SetupPoseBoundsProvider", "@esotericsoftware/spine-phaser", false);

                const cls = this.spineClassName(obj, "SetupPoseBoundsProvider");

                return `new ${cls}()`;
            }

            unit.addImport("SkinsAndAnimationBoundsProvider", "@esotericsoftware/spine-phaser", false);

            const cls = this.spineClassName(obj, "SkinsAndAnimationBoundsProvider");

            const animation = JSON.stringify(obj.bpAnimation);

            let skins: string[] = [];

            if (obj.bpSkin === BoundsProviderSkin.CURRENT_SKIN) {

                if (obj.skeleton.skin) {

                    skins = [obj.skeleton.skin.name];
                }

            } else {

                skins = obj.skeleton.data.skins.map(skin => skin.name);
            }

            if (obj.bpTimeStep == 0.05) {

                return `new ${cls}(${animation}, ${JSON.stringify(skins)})`;
            }

            return `new ${cls}(${animation}, ${JSON.stringify(skins)}, ${obj.bpTimeStep})`;
        }

        buildPrefabConstructorDeclarationCodeDOM(args: IBuildPrefabConstructorDeclarationCodeDOM): void {

            const obj = args.prefabObj as SpineObject;
            const objES = obj.getEditorSupport();

            args.importTypes.push("Phaser.Scene");
            args.unit.addImport("SpinePlugin", "@esotericsoftware/spine-phaser", false);
            args.unit.addImport("SpineGameObjectBoundsProvider", "@esotericsoftware/spine-phaser", false);

            const ctr = args.ctrDeclCodeDOM;

            ctr.arg("plugin", SpineCodeDOMBuilder.spineClassName(obj, "SpinePlugin"));
            ctr.arg("x", "number");
            ctr.arg("y", "number");

            // you can't override the dataKey and atlasKey of a spine game object
            // ctr.arg("dataKey", "string");
            // ctr.arg("atlasKey", "string");

            ctr.arg("boundsProvider", SpineCodeDOMBuilder.spineClassName(obj, "SpineGameObjectBoundsProvider"), true);
        }

        public static spineClassName(obj: ISceneGameObject, cls: string) {

            const scene = obj.getEditorSupport().getScene();

            if (scene.isESModule()) {

                return cls;
            }

            return "spine." + cls;
        }

        buildPrefabConstructorDeclarationSupperCallCodeDOM(
            args: IBuildPrefabConstructorDeclarationSupperCallCodeDOMArgs): void {

            const obj = args.prefabObj as SpineObject;
            const objES = obj.getEditorSupport();

            const call = args.superMethodCallCodeDOM;

            call.arg("plugin");

            this.buildPrefabConstructorDeclarationSupperCallCodeDOM_XYParameters(args);

            if (!objES.isPrefabInstance()) {
                // hey, this is a prefab variant
                // the dataKey and atlasKey are set in the super prefab
                call.argLiteral(SpineComponent.dataKey.getValue(obj));
                call.argLiteral(SpineComponent.atlasKey.getValue(obj));
            }

            const expr = SpineCodeDOMBuilder.generateNewBoundsProviderExpression(obj, args.unit);

            if (objES.isUnlockedProperty(SpineComponent.bpType)) {

                call.arg(`boundsProvider ?? ${expr}`);

            } else {

                call.arg("boundsProvider");
            }
        }
    }
}