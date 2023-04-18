namespace phasereditor2d.scene.ui.sceneobjects {

    export class SliceOperation extends editor.tools.SceneToolOperation<ISliceData> {

        getInitialValue(obj: any) {

            return SliceToolItem.getInitialData(obj);
        }

        getFinalValue(obj: NineSlice | ThreeSlice): ISliceData {

            if (obj instanceof NineSlice) {

                return {
                    leftWidth: obj.leftWidth,
                    rightWidth: obj.rightWidth,
                    topHeight: obj.topHeight,
                    bottomHeight: obj.bottomHeight
                };
            }

            return {
                leftWidth: obj.leftWidth,
                rightWidth: obj.rightWidth,
                topHeight: 0,
                bottomHeight: 0
            };
        }

        setValue(obj: NineSlice | ThreeSlice, value: ISliceData) {

            const props = obj instanceof NineSlice ?
                NineSliceComponent.sliceProperties : ThreeSliceComponent.sliceProperties;

            for (const prop of props) {

                console.log("set ", prop.name, value[prop.name]);
                prop.setValue(obj, value[prop.name]);
            }
        }
    }
}