namespace phasereditor2d.scene.ui.sceneobjects {

    export class SliceTool extends BaseObjectTool {

        static ID = "phasereditor2d.scene.ui.sceneobjects.SliceTool";

        constructor() {
            super({
                id: SliceTool.ID,
                command: editor.commands.CMD_EDIT_SLICE_SCENE_OBJECT,
            });

            this.addItems(
                new SliceToolItem("leftWidth"),
                new SliceToolItem("rightWidth"),
                new SliceToolItem("topHeight"),
                new SliceToolItem("bottomHeight"),
            );
        }

        isValidForAll(objects: ISceneGameObject[]): boolean {

            return objects.length === 1;
        }

        getProperties(obj: ISceneGameObject) {

            if (obj instanceof NineSlice) {

                return NineSliceComponent.sliceProperties;
            }

            if (obj instanceof ThreeSlice) {

                return ThreeSliceComponent.sliceProperties;
            }

            return [];
        }

        onActivated(args: editor.tools.ISceneToolContextArgs) {

            super.onActivated(args);

            const props = args.objects.flatMap(obj => {

                if (obj instanceof NineSlice) {

                    return NineSliceComponent.sliceProperties;
                }

                return ThreeSliceComponent.sliceProperties;
            });

            const sections = args.objects.flatMap(obj => {

                if (obj instanceof NineSlice) {

                    return NineSliceSection.SECTION_ID;
                }

                return ThreeSliceSection.SECTION_ID;
            });

            this.confirmUnlockProperty(args, props, "slice", ...sections);
        }
    }
}