namespace phasereditor2d.scene.ui.sceneobjects {

    import code = core.code;

    export abstract class FXObjectCodeDOMBuilder<T extends Phaser.FX.Controller> extends GameObjectCodeDOMBuilder {

        private _fxName: string;

        constructor(fxName: string) {
            super();

            this._fxName = fxName;
        }

        abstract buildAddFXMethodArgs(call: code.MethodCallCodeDOM, fx: T, args: IBuildObjectFactoryCodeDOMArgs): void;

        buildCreateObjectWithFactoryCodeDOM(args: IBuildObjectFactoryCodeDOMArgs): core.code.MethodCallCodeDOM {

            const obj = args.obj as FXObject;

            const pipeline = obj.isPreFX() ? "preFX" : "postFX";

            const varname = `${args.parentVarName}.${pipeline}`;

            const call = new code.MethodCallCodeDOM("add" + this._fxName, varname);
            call.setOptionalContext(true);

            const fx = obj.getPhaserFX() as T;

            this.buildAddFXMethodArgs(call, fx, args);

            return call;
        }

        buildCreatePrefabInstanceCodeDOM(args: IBuildPrefabConstructorCodeDOMArgs): void {

            throw new Error("FX prefab not supported.");
        }

        buildPrefabConstructorDeclarationCodeDOM(args: IBuildPrefabConstructorDeclarationCodeDOM): void {

            throw new Error("FX prefab not supported.");
        }

        buildPrefabConstructorDeclarationSupperCallCodeDOM(args: IBuildPrefabConstructorDeclarationSupperCallCodeDOMArgs): void {

            throw new Error("FX prefab not supported.");
        }
    }
}