namespace phasereditor2d.scene.ui.sceneobjects {

    import code = core.code;

    export class ThreeSliceCodeDOMBuilder extends BaseImageCodeDOMBuilder {

        constructor() {
            super("nineslice");
        }

        buildCreatePrefabInstanceCodeDOM(args: IBuildPrefabConstructorCodeDOMArgs) {

            const obj = args.obj as NineSlice;
            const objES = obj.getEditorSupport();
            const call = args.methodCallDOM;

            call.arg(args.sceneExpr);

            this.buildCreatePrefabInstanceCodeDOM_XY_Arguments(args);

            // texture

            if (objES.isUnlockedProperty(TextureComponent.texture)) {

                this.addTextureFrameArgsToObjectFactoryMethodCallDOM(
                    args.methodCallDOM, args.obj as ITextureLikeObject);
            } else {

                call.argUndefined();
                call.argUndefined();
            }

            // size (only the "width" argument matters)

            if (obj.getEditorSupport().isUnlockedPropertyXY(SizeComponent.size)) {

                call.argFloat(obj.width);

            } else {

                call.argUndefined();
            }

            // 3-slice

            for (const prop of [
                NineSliceComponent.leftWidth,
                NineSliceComponent.rightWidth]) {

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
            ctr.arg("leftWidth", "number", true);
            ctr.arg("rightWidth", "number", true);
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
                call.argFloat(0); // height

            } else {

                call.arg("width");
                call.argFloat(0); // height
            }

            for (const prop of [
                ThreeSliceComponent.leftWidth,
                ThreeSliceComponent.rightWidth]) {

                if (objES.isUnlockedProperty(prop)) {

                    call.arg(prop.name + " ?? " + prop.getValue(obj));

                } else {

                    call.arg(prop.name);
                }
            }

            call.argFloat(0); // topHeight
            call.argFloat(0); // bottomHeight
        }

        buildCreateObjectWithFactoryCodeDOM(args: IBuildObjectFactoryCodeDOMArgs): code.MethodCallCodeDOM {

            const obj = args.obj as NineSlice;
            const call = new code.MethodCallCodeDOM("nineslice", args.gameObjectFactoryExpr);

            call.argFloat(obj.x);
            call.argFloat(obj.y);

            this.addTextureFrameArgsToObjectFactoryMethodCallDOM(call, obj);

            call.argFloat(obj.width);
            call.argFloat(0);

            call.argFloat(obj.leftWidth);
            call.argFloat(obj.rightWidth);
            call.argFloat(0);
            call.argFloat(0);

            return call;
        }
    }
}