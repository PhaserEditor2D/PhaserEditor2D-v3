/// <reference path="./BaseObjectTool.ts" />

namespace phasereditor2d.scene.ui.sceneobjects {

    import controls = colibri.ui.controls;

    export class RotateTool extends BaseObjectTool {

        static ID = "phasereditor2d.scene.ui.sceneobjects.RotateTool";

        constructor() {
            super({
                id: RotateTool.ID,
                command: editor.commands.CMD_ROTATE_SCENE_OBJECT,
            }, TransformComponent.angle);

            this.addItems(
                new RotateLineToolItem(true),
                new RotateLineToolItem(false),
                new editor.tools.CenterPointToolItem(RotateToolItem.COLOR),
                new RotateToolItem()
            );
        }

        onActivated(args: editor.tools.ISceneToolContextArgs) {

            super.onActivated(args);

            this.confirmUnlockProperty(args, [sceneobjects.TransformComponent.angle], "angle", TransformSection.SECTION_ID);
        }
    }
}