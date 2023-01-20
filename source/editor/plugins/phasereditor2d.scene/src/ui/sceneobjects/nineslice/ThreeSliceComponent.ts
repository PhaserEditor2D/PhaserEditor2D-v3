namespace phasereditor2d.scene.ui.sceneobjects {

    function sliceProperty(
        name: "leftWidth" | "rightWidth", defValue: any, label: string): IProperty<any> {

        return {
            name,
            defValue,
            label,
            tooltip: "TODO",
            local: false,
            getValue: obj => obj[name],
            setValue: (obj: ThreeSlice, value) => {

                const data = {
                    leftWidth: obj.leftWidth,
                    rightWidth: obj.rightWidth
                };

                data[name] = value;

                obj.setSlices(
                    obj.width, 0,
                    data.leftWidth, data.rightWidth,
                    0, 0);
            }
        };
    }

    export class ThreeSliceComponent extends Component<ThreeSlice> {

        static leftWidth = sliceProperty("leftWidth", 10, "L");
        static rightWidth = sliceProperty("rightWidth", 10, "R");

        static horizontalWidth: IPropertyXY = {
            label: "Slice Width",
            x: ThreeSliceComponent.leftWidth,
            y: ThreeSliceComponent.rightWidth,
        }

        constructor(obj: ThreeSlice) {
            super(obj, [
                ThreeSliceComponent.leftWidth,
                ThreeSliceComponent.rightWidth
            ]);
        }

        buildSetObjectPropertiesCodeDOM(args: ISetObjectPropertiesCodeDOMArgs): void {

            const objES = this.getEditorSupport();

            if (objES.isNestedPrefabInstance()) {

                const len = args.statements.length;

                for (const prop of [
                    ThreeSliceComponent.leftWidth,
                    ThreeSliceComponent.rightWidth]) {

                    this.buildSetObjectPropertyCodeDOM_FloatProperty(args, prop);
                }

                if (args.statements.length > len) {
                    // when one of the above properties is changed,
                    // it requires to call the updateVertices() method.
                    const dom = new core.code.MethodCallCodeDOM("updateVertices", args.objectVarName);
                    args.statements.push(dom);
                }
            }
        }
    }
}