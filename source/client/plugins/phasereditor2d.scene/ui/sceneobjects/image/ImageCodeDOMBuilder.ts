/// <reference path="../ObjectCodeDOMBuilder.ts" />

namespace phasereditor2d.scene.ui.sceneobjects {

    import code = core.code;

    export class ImageCodeDOMBuilder extends ObjectCodeDOMBuilder {

        private static _instance: ImageCodeDOMBuilder = new ImageCodeDOMBuilder();

        static getInstance(): ObjectCodeDOMBuilder {
            return this._instance;
        }

        buildPrefabConstructorDeclarationSupperCallCodeDOM(
            args: BuildPrefabConstructorDeclarationSupperCallCodeDOMArgs): void {

            const call = args.superMethodCallCodeDOM;

            call.arg("x");
            call.arg("y");

            const obj = args.prefabObj as Image;

            const textureComponent = obj.getEditorSupport().getTextureComponent();

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

        buildPrefabConstructorDeclarationCodeDOM(args: BuildPrefabConstructorDeclarationCodeDOM): void {

            const ctr = args.ctrDeclCodeDOM;

            ctr.addArg("x", "number");
            ctr.addArg("y", "number");
            ctr.addArg("texture", "string");
            ctr.addArg("frame", "number | string", true);
        }

        buildCreatePrefabInstanceCodeDOM(args: BuildPrefabConstructorCodeDOMArgs) {

            const call = args.methodCallDOM;

            call.arg(args.sceneExpr);

            this.addArgsToCreateMethodDOM(call, args.obj as Image);
        }

        buildCreateObjectWithFactoryCodeDOM(args: BuildObjectFactoryCodeDOMArgs): code.MethodCallCodeDOM {

            const call = new code.MethodCallCodeDOM("image", args.gameObjectFactoryExpr);

            this.addArgsToCreateMethodDOM(call, args.obj as Image);

            return call;
        }

        private addArgsToCreateMethodDOM(call: code.MethodCallCodeDOM, obj: Image) {

            call.argFloat(obj.x);
            call.argFloat(obj.y);

            const support = obj.getEditorSupport();

            const textureComponent = obj.getEditorSupport().getTextureComponent();

            const { key, frame } = textureComponent.getTextureKeys();

            if (support.isPrefabInstance()) {

                const prefabSerializer = support.getPrefabSerializer();

                if (prefabSerializer) {

                    const prefabKeys = prefabSerializer.read(TextureComponent.TEXTURE_KEYS_NAME) as TextureKeys;

                    if (prefabKeys.key === key) {

                        return call;
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