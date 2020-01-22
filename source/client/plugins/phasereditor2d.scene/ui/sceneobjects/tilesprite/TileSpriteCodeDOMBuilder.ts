namespace phasereditor2d.scene.ui.sceneobjects {

    import code = core.code;

    export class TileSpriteCodeDOMBuilder extends BaseImageCodeDOMBuilder {

        constructor() {
            super("tileSprite");
        }

        buildPrefabConstructorDeclarationCodeDOM(args: IBuildPrefabConstructorDeclarationCodeDOM): void {

            const ctr = args.ctrDeclCodeDOM;

            ctr.addArg("x", "number");
            ctr.addArg("y", "number");
            ctr.addArg("width", "number", true);
            ctr.addArg("height", "number", true);
            ctr.addArg("texture", "string", true);
            ctr.addArg("frame", "number | string", true);
        }

        buildPrefabConstructorDeclarationSupperCallCodeDOM(
            args: IBuildPrefabConstructorDeclarationSupperCallCodeDOMArgs): void {

            const obj = args.prefabObj as TileSprite;

            const call = args.superMethodCallCodeDOM;

            call.arg("x");
            call.arg("y");

            call.arg("typeof width === \"number\" ? width : " + obj.width);
            call.arg("typeof height === \"number\" ? height : " + obj.width);

            this.buildPrefabConstructorDeclarationSupperCallCodeDOM_TextureParameters(args, call);
        }

        protected addArgsToObjectFactoryMethodCallDOM(call: code.MethodCallCodeDOM, obj: ITransformLikeObject) {

            const tileSprite = obj as TileSprite;

            call.argFloat(tileSprite.x);
            call.argFloat(tileSprite.y);

            const support = obj.getEditorSupport();

            let width = tileSprite.width;
            let height = tileSprite.height;

            if (support.isPrefabInstance()) {

                if (!support.isUnlockedProperty(TileSpriteComponent.width)) {
                    width = undefined;
                }

                if (!support.isUnlockedProperty(TileSpriteComponent.height)) {
                    height = undefined;
                }
            }

            call.argFloat(width);
            call.argFloat(height);

            this.addTextureFrameArgsToObjectFactoryMethodCallDOM(call, obj);
        }
    }
}