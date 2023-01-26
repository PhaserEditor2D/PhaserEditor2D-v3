namespace phasereditor2d.scene.ui.sceneobjects {

    export const updateVertices = (obj: NineSlice) => {

        obj.updateVertices();
        (obj as any).updateUVs();
    };

    function sliceProperty(
        name: "leftWidth" | "rightWidth" | "topHeight" | "bottomHeight", defValue: any, label: string): IProperty<any> {

        return {
            name,
            defValue,
            label,
            tooltip: `phaser:Phaser.GameObjects.NineSlice.${name}`,
            local: false,
            getValue: obj => obj[name],
            setValue: (obj: NineSlice, value) => {

                const data = {
                    leftWidth: obj.leftWidth,
                    rightWidth: obj.rightWidth,
                    topHeight: obj.topHeight,
                    bottomHeight: obj.bottomHeight
                };

                data[name] = value;

                obj.setSlices(
                    obj.width, obj.height,
                    data.leftWidth, data.rightWidth,
                    data.topHeight, data.bottomHeight);
            }
        };
    }

    export class NineSliceComponent extends Component<NineSlice> {

        static leftWidth = sliceProperty("leftWidth", 10, "L");
        static rightWidth = sliceProperty("rightWidth", 10, "R");
        static topHeight = sliceProperty("topHeight", 10, "T");
        static bottomHeight = sliceProperty("bottomHeight", 10, "B");

        static horizontalWidth: IPropertyXY = {
            label: "Slice Width",
            x: NineSliceComponent.leftWidth,
            y: NineSliceComponent.rightWidth,
        }
        static verticalWidth: IPropertyXY = {
            label: "Slice Height",
            x: NineSliceComponent.topHeight,
            y: NineSliceComponent.bottomHeight,
        }

        static sliceProperties = [
            NineSliceComponent.leftWidth,
            NineSliceComponent.rightWidth,
            NineSliceComponent.topHeight,
            NineSliceComponent.bottomHeight
        ];

        constructor(obj: NineSlice) {
            super(obj,
                NineSliceComponent.sliceProperties);
        }

        buildSetObjectPropertiesCodeDOM(args: ISetObjectPropertiesCodeDOMArgs): void {

            const objES = this.getEditorSupport();

            if (objES.isNestedPrefabInstance()) {

                let onlySizeChanged = true;

                for (const prop of NineSliceComponent.sliceProperties) {

                    if (objES.isUnlockedProperty(prop)) {

                        onlySizeChanged = false;
                    }
                }

                if (onlySizeChanged) {

                    const sizeComponent = objES.getComponent(SizeComponent) as SizeComponent;

                    sizeComponent.buildSetObjectPropertiesCodeDOM(args, false);

                } else {

                    this.buildSetObjectPropertiesWithMethodCodeDOM_FloatProperty(
                        args,
                        "setSlices",
                        SizeComponent.width,
                        SizeComponent.height,
                        ...NineSliceComponent.sliceProperties);
                }
            }
        }
    }
}