/// <reference path="../GameObjectCodeDOMBuilder.ts" />

namespace phasereditor2d.scene.ui.sceneobjects {

    import code = core.code;

    export class BaseImageCodeDOMBuilder extends GameObjectCodeDOMBuilder {

        private _factoryMethodName: string;

        constructor(factoryMethodName: string) {
            super();

            this._factoryMethodName = factoryMethodName;
        }

        buildPrefabConstructorDeclarationSupperCallCodeDOM(
            args: IBuildPrefabConstructorDeclarationSupperCallCodeDOMArgs): void {

            const call = args.superMethodCallCodeDOM;

            call.arg("x");
            call.arg("y");

            this.buildPrefabConstructorDeclarationSupperCallCodeDOM_TextureParameters(args, call);
        }

        protected buildPrefabConstructorDeclarationSupperCallCodeDOM_TextureParameters(
            args: IBuildPrefabConstructorDeclarationSupperCallCodeDOMArgs,
            call: code.MethodCallCodeDOM) {

            const obj = args.prefabObj as ITextureLikeObject;
            const support = obj.getEditorSupport();

            if (support.isLockedProperty(TextureComponent.texture)) {

                call.arg("texture");
                call.arg("frame");

            } else {

                const texture = TextureComponent.texture.getValue(obj) as ITextureKeys;
                const key = texture.key || "__DEFAULT";
                const frame = texture.frame;

                call.arg("texture || " + code.CodeDOM.quote(key));

                let frameCode: string;

                if (typeof frame === "string") {

                    frameCode = code.CodeDOM.quote(frame);

                } else if (typeof frame === "number") {

                    frameCode = frame.toString();
                }

                if (frameCode) {

                    call.arg("frame !== undefined && frame !== null ? frame : " + frameCode);

                } else {

                    call.arg("frame");
                }
            }
        }

        buildPrefabConstructorDeclarationCodeDOM(args: IBuildPrefabConstructorDeclarationCodeDOM): void {

            const ctr = args.ctrDeclCodeDOM;

            ctr.arg("x", "number");
            ctr.arg("y", "number");
            ctr.arg("texture", "string", true);
            ctr.arg("frame", "number | string", true);
        }

        buildCreatePrefabInstanceCodeDOM(args: IBuildPrefabConstructorCodeDOMArgs) {

            const obj = args.obj as Image;
            const support = obj.getEditorSupport();
            const call = args.methodCallDOM;

            call.arg(args.sceneExpr);
            call.argFloat(obj.x);
            call.argFloat(obj.y);

            if (support.isUnlockedProperty(TextureComponent.texture)) {

                this.addTextureFrameArgsToObjectFactoryMethodCallDOM(
                    args.methodCallDOM, args.obj as ITextureLikeObject);
            }
        }

        buildCreateObjectWithFactoryCodeDOM(args: IBuildObjectFactoryCodeDOMArgs): code.MethodCallCodeDOM {

            const obj = args.obj as Image;
            const call = new code.MethodCallCodeDOM(this._factoryMethodName, args.gameObjectFactoryExpr);

            call.argFloat(obj.x);
            call.argFloat(obj.y);

            this.addTextureFrameArgsToObjectFactoryMethodCallDOM(call, args.obj as ITextureLikeObject);

            return call;
        }

        protected addTextureFrameArgsToObjectFactoryMethodCallDOM(
            call: code.MethodCallCodeDOM, obj: ITextureLikeObject) {

            const texture = TextureComponent.texture.getValue(obj) as ITextureKeys;

            if (texture.key) {

                call.argLiteral(texture.key);

                call.argStringOrInt(texture.frame);

            } else {

                call.argLiteral("__DEFAULT");
            }
        }
    }
}