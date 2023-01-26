namespace phasereditor2d.scene.ui.sceneobjects {

    function sliceProperty(
        name: "leftWidth" | "rightWidth", defValue: any, label: string): IProperty<any> {

        return {
            name,
            defValue,
            label,
            tooltip: `phaser:Phaser.GameObjects.NineSlice.${name}`,
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
        static sliceProperties = [
            ThreeSliceComponent.leftWidth,
            ThreeSliceComponent.rightWidth
        ];

        static horizontalWidth: IPropertyXY = {
            label: "Slice Width",
            x: ThreeSliceComponent.leftWidth,
            y: ThreeSliceComponent.rightWidth,
        }

        constructor(obj: ThreeSlice) {
            super(obj, ThreeSliceComponent.sliceProperties);
        }

        buildSetObjectPropertiesCodeDOM(args: ISetObjectPropertiesCodeDOMArgs): void {

            const objES = this.getEditorSupport();

            if (objES.isNestedPrefabInstance()) {

                let onlySizeChanged = true;

                for (const prop of ThreeSliceComponent.sliceProperties) {

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
                        ...ThreeSliceComponent.sliceProperties);
                }
            }
        }
    }
}