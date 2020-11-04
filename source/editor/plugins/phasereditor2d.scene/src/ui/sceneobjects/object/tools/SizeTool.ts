namespace phasereditor2d.scene.ui.sceneobjects {

    export class SizeTool extends BaseObjectTool {

        static ID = "phasereditor2d.scene.ui.sceneobjects.SizeTool";

        constructor() {
            super({
                id: SizeTool.ID,
                command: editor.commands.CMD_RESIZE_SCENE_OBJECT,
            }, SizeComponent.width, SizeComponent.height);

            this.addItems(
                new SizeToolItem(1, 0.5),
                new SizeToolItem(1, 1),
                new SizeToolItem(0.5, 1),
            );
        }

        canEdit(obj: unknown) {

            return GameObjectEditorSupport.hasObjectComponent(obj, SizeComponent);
        }
    }
}