/// <reference path="../ObjectCodeDOMBuilder.ts" />

namespace phasereditor2d.scene.ui.sceneobjects {

    import code = core.code;

    export class BaseImageCodeDOMBuilder extends ObjectCodeDOMBuilder {

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

            const obj = args.prefabObj;
            const support = obj.getEditorSupport();

            if (support.isPrefabInstance() && !support.isUnlockedProperty(TextureComponent.texture)) {

                call.arg("texture");
                call.arg("frame");

            } else {

                const textureComponent = obj.getEditorSupport().getComponent(TextureComponent) as TextureComponent;

                const { key, frame } = textureComponent.getTextureKeys();

                if (typeof key === "string") {

                    call.arg("texture || " + code.CodeDOM.quote(key));

                    let frameLiteral: string;

                    if (typeof frame === "string") {

                        frameLiteral = code.CodeDOM.quote(frame);

                    } else if (typeof frame === "number") {

                        frameLiteral = frame.toString();
                    }

                    if (frameLiteral) {

                        call.arg("frame !== undefined && frame !== null ? frame : " + frameLiteral);
                    }

                } else {

                    call.arg("texture");
                    call.arg("key");
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

            const call = args.methodCallDOM;

            call.arg(args.sceneExpr);

            this.addArgsToObjectFactoryMethodCallDOM(call, args.obj as Image);
        }

        buildCreateObjectWithFactoryCodeDOM(args: IBuildObjectFactoryCodeDOMArgs): code.MethodCallCodeDOM {

            const call = new code.MethodCallCodeDOM(this._factoryMethodName, args.gameObjectFactoryExpr);

            this.addArgsToObjectFactoryMethodCallDOM(call, args.obj as Image);

            return call;
        }

        protected addArgsToObjectFactoryMethodCallDOM(call: code.MethodCallCodeDOM, obj: ITransformLikeObject) {

            call.argFloat(obj.x);
            call.argFloat(obj.y);

            this.addTextureFrameArgsToObjectFactoryMethodCallDOM(call, obj);
        }

        protected addTextureFrameArgsToObjectFactoryMethodCallDOM(
            call: code.MethodCallCodeDOM, obj: ITransformLikeObject) {

            const support = obj.getEditorSupport();

            const textureComponent = support.getComponent(TextureComponent) as TextureComponent;

            const { key, frame } = textureComponent.getTextureKeys();

            if (support.isPrefabInstance()) {

                const prefabSerializer = support.getPrefabSerializer();

                if (prefabSerializer) {

                    const prefabKeys = prefabSerializer.read(TextureComponent.texture.name, {}) as ITextureKeys;

                    if (prefabKeys.key === key) {

                        return;
                    }

                } else {

                    throw new Error(`Cannot find prefab with id ${support.getPrefabId()}.`);
                }
            }

            call.argLiteral(key);

            if (typeof frame === "number") {

                call.argInt(frame);

            } else if (typeof frame === "string") {

                call.argLiteral(frame);
            }
        }
    }
}