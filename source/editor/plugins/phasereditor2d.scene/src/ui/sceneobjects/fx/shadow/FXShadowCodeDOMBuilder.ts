/// <reference path="../FXObjectCodeDOMBuilder.ts" />

namespace phasereditor2d.scene.ui.sceneobjects {

    import code = core.code;

    export class FXShadowCodeDOMBuilder extends FXObjectCodeDOMBuilder {

        buildCreateObjectWithFactoryCodeDOM(args: IBuildObjectFactoryCodeDOMArgs): core.code.MethodCallCodeDOM {

            const obj = args.obj as FXShadow;

            const pipeline = obj.isPreFX()? "preFX" : "postFX";

            const varname = `${args.parentVarName}.${pipeline}`;

            const call = new code.MethodCallCodeDOM("addShadow", varname);

            const fx = obj.getPhaserFX();

            // call.argFloat(fx.color);
            // call.argFloat(fx.outerStrength);
            // call.argFloat(fx.innerStrength);
            // call.argBool(fx.knockout as any);

            return call;
        }
    }
}