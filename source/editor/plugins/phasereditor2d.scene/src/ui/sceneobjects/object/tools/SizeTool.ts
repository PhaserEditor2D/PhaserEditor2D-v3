namespace phasereditor2d.scene.ui.sceneobjects {

    export class SizeTool extends BaseObjectTool {

        static ID = "phasereditor2d.scene.ui.sceneobjects.SizeTool";

        constructor() {
            super({
                id: SizeTool.ID,
                command: editor.commands.CMD_RESIZE_SCENE_OBJECT,
            });

            this.addItems(
                new SizeToolItem(1, 0.5),
                new SizeToolItem(1, 1),
                new SizeToolItem(0.5, 1),
            );
        }

        getProperties(obj: ISceneGameObject) {

            return obj.getEditorSupport().getSizeProperties();
        }

        onActivated(args: editor.tools.ISceneToolContextArgs) {

            super.onActivated(args);

            const props = args.objects.flatMap(obj => obj.getEditorSupport().getSizeProperties());

            const sections = args.objects.flatMap(obj => obj.getEditorSupport().getSizeSectionId());

            this.confirmUnlockProperty(args, props, "size", ...sections);
        }
    }
}