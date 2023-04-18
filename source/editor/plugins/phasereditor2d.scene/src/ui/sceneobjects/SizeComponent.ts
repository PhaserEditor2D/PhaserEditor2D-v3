namespace phasereditor2d.scene.ui.sceneobjects {

    export interface ISizeLikeObject extends ISceneGameObject {
        width: number;
        height: number;
        setSize(width: number, height: number): void;
        updateDisplayOrigin();
    }

    export class SizeComponent extends Component<ISizeLikeObject> {

        static FLAG_DISABLE_GENERATE_UPDATE_DISPALY_ORIGIN = "updateDispyOrigin";

        // static width = SimpleProperty("width", 0, "Width", "The object's width.", false, updateDisplayOrigin);
        // static height = SimpleProperty("height", 0, "Height", "The object's height.", false, updateDisplayOrigin);
        static width: IProperty<ISizeLikeObject> = {
            name: "width",
            defValue: 0,
            label: "W",
            tooltip: "The object's width.",
            local: false,
            getValue: obj => obj.width,
            setValue: (obj, value) => {

                obj.setSize(value, obj.height);
                obj.updateDisplayOrigin();
            }
        };

        static height: IProperty<ISizeLikeObject> = {
            name: "height",
            label: "H",
            defValue: 0,
            tooltip: "The object's height.",
            local: false,
            getValue: obj => obj.height,
            setValue: (obj, value) => {

                obj.setSize(obj.width, value);
                obj.updateDisplayOrigin();
            }
        };

        static size: IPropertyXY = {
            label: "Size",
            x: SizeComponent.width,
            y: SizeComponent.height
        }

        constructor(obj: ISizeLikeObject) {
            super(obj, [SizeComponent.width, SizeComponent.height]);
        }

        buildSetObjectPropertiesCodeDOM(args: ISetObjectPropertiesCodeDOMArgs, checkCustom = true): void {

            const obj = this.getObject();
            const objES = obj.getEditorSupport();

            if (checkCustom && objES.isCustom_SizeComponent_buildSetObjectPropertiesCodeDOM()) {

                return;
            }

            const prop = SizeComponent.size;

            if (objES.isNestedPrefabInstance()
                && objES.isUnlockedPropertyXY(prop)) {

                const dom = new core.code.MethodCallCodeDOM("setSize", args.objectVarName);
                dom.argFloat(prop.x.getValue(obj));
                dom.argFloat(prop.y.getValue(obj));
                args.statements.push(dom);

                if (objES.getSizeComponentGeneratesUpdateDisplayOrigin()) {

                    args.statements.push(
                        new core.code.MethodCallCodeDOM("updateDisplayOrigin", args.objectVarName));
                }
            }
        }
    }
}