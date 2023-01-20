namespace phasereditor2d.scene.ui.sceneobjects {

    import code = core.code;

    export class NineSliceCodeDOMBuilder extends BaseImageCodeDOMBuilder {

        constructor() {
            super("nineslice");
        }

        buildCreatePrefabInstanceCodeDOM(args: IBuildPrefabConstructorCodeDOMArgs) {

            const obj = args.obj as NineSlice;
            const objES = obj.getEditorSupport();
            const call = args.methodCallDOM;

            call.arg(args.sceneExpr);

            this.buildCreatePrefabInstanceCodeDOM_XY_Arguments(args);

            if (objES.isUnlockedProperty(TextureComponent.texture)) {

                this.addTextureFrameArgsToObjectFactoryMethodCallDOM(
                    args.methodCallDOM, args.obj as ITextureLikeObject);
            } else {

                call.argUndefined();
                call.argUndefined();
            }

            if (obj.getEditorSupport().isUnlockedPropertyXY(SizeComponent.size)) {

                call.argFloat(obj.width);
                call.argFloat(obj.height);

            } else {

                call.argUndefined();
                call.argUndefined();
            }

            for (const prop of [
                NineSliceComponent.leftWidth,
                NineSliceComponent.rightWidth,
                NineSliceComponent.topHeight,
                NineSliceComponent.bottomHeight]) {

                if (objES.isUnlockedProperty(prop)) {

                    call.argFloat(prop.getValue(obj));

                } else {

                    call.arg("undefined");
                }
            }
        }

        buildPrefabConstructorDeclarationCodeDOM(args: IBuildPrefabConstructorDeclarationCodeDOM): void {

            const ctr = args.ctrDeclCodeDOM;

            ctr.arg("x", "number", true);
            ctr.arg("y", "number", true);
            ctr.arg("texture", "string", true);
            ctr.arg("frame", "number | string", true);
            ctr.arg("width", "number", true);
            ctr.arg("height", "number", true);
            ctr.arg("leftWidth", "number", true);
            ctr.arg("rightWidth", "number", true);
            ctr.arg("topHeight", "number", true);
            ctr.arg("bottomHeight", "number", true);
        }

        buildPrefabConstructorDeclarationSupperCallCodeDOM(
            args: IBuildPrefabConstructorDeclarationSupperCallCodeDOMArgs): void {

            const obj = args.prefabObj as NineSlice;
            const objES = obj.getEditorSupport();

            const call = args.superMethodCallCodeDOM;

            this.buildPrefabConstructorDeclarationSupperCallCodeDOM_XYParameters(args);

            this.buildPrefabConstructorDeclarationSupperCallCodeDOM_TextureParameters(args, call);

            if (objES.isUnlockedPropertyXY(SizeComponent.size)) {

                call.arg("width ?? " + obj.width);
                call.arg("height ?? " + obj.height);

            } else {

                call.arg("width");
                call.arg("height");
            }

            for (const prop of [
                NineSliceComponent.leftWidth,
                NineSliceComponent.rightWidth,
                NineSliceComponent.topHeight,
                NineSliceComponent.bottomHeight]) {

                if (objES.isUnlockedProperty(prop)) {

                    call.arg(prop.name + " ?? " + prop.getValue(obj));

                } else {

                    call.arg(prop.name);
                }
            }
        }

        buildCreateObjectWithFactoryCodeDOM(args: IBuildObjectFactoryCodeDOMArgs): code.MethodCallCodeDOM {

            const obj = args.obj as NineSlice;
            const call = new code.MethodCallCodeDOM("nineslice", args.gameObjectFactoryExpr);

            call.argFloat(obj.x);
            call.argFloat(obj.y);

            this.addTextureFrameArgsToObjectFactoryMethodCallDOM(call, obj);

            call.argFloat(obj.width);
            call.argFloat(obj.height);

            call.argFloat(obj.leftWidth);
            call.argFloat(obj.rightWidth);
            call.argFloat(obj.topHeight);
            call.argFloat(obj.bottomHeight);

            return call;
        }
    }
}