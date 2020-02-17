namespace phasereditor2d.scene.ui.sceneobjects {

    import code = core.code;

    export class TileSpriteCodeDOMBuilder extends BaseImageCodeDOMBuilder {

        constructor() {
            super("tileSprite");
        }

        buildCreatePrefabInstanceCodeDOM(args: IBuildPrefabConstructorCodeDOMArgs) {

            const obj = args.obj as TileSprite;
            const support = obj.getEditorSupport();
            const call = args.methodCallDOM;

            call.arg(args.sceneExpr);
            call.argFloat(obj.x);
            call.argFloat(obj.y);

            if (support.isUnlockedProperty(TileSpriteComponent.width)) {

                call.argFloat(obj.width);

            } else {

                call.arg("undefined");
            }

            if (support.isUnlockedProperty(TileSpriteComponent.height)) {

                call.argFloat(obj.height);

            } else {

                call.arg("undefined");
            }

            if (support.isUnlockedProperty(TextureComponent.texture)) {

                this.addTextureFrameArgsToObjectFactoryMethodCallDOM(
                    args.methodCallDOM, args.obj as ITextureLikeObject);
            }
        }

        buildPrefabConstructorDeclarationCodeDOM(args: IBuildPrefabConstructorDeclarationCodeDOM): void {

            const ctr = args.ctrDeclCodeDOM;

            ctr.arg("x", "number");
            ctr.arg("y", "number");
            ctr.arg("width", "number", true);
            ctr.arg("height", "number", true);
            ctr.arg("texture", "string", true);
            ctr.arg("frame", "number | string", true);
        }

        buildPrefabConstructorDeclarationSupperCallCodeDOM(
            args: IBuildPrefabConstructorDeclarationSupperCallCodeDOMArgs): void {

            const obj = args.prefabObj as TileSprite;
            const support = obj.getEditorSupport();

            const call = args.superMethodCallCodeDOM;

            call.arg("x");
            call.arg("y");

            if (support.isLockedProperty(TileSpriteComponent.width)) {

                call.argFloat(obj.width);

            } else {

                call.arg("typeof width === \"number\" ? width : " + obj.width);
            }

            if (support.isLockedProperty(TileSpriteComponent.height)) {

                call.argFloat(obj.height);

            } else {

                call.arg("typeof height === \"number\" ? height : " + obj.height);
            }

            this.buildPrefabConstructorDeclarationSupperCallCodeDOM_TextureParameters(args, call);
        }

        protected addArgsToObjectFactoryMethodCallDOM(call: code.MethodCallCodeDOM, obj: ITextureLikeObject) {

            const tileSprite = obj as TileSprite;

            call.argFloat(tileSprite.x);
            call.argFloat(tileSprite.y);
            call.argFloat(tileSprite.width);
            call.argFloat(tileSprite.height);

            this.addTextureFrameArgsToObjectFactoryMethodCallDOM(call, obj);
        }
    }
}