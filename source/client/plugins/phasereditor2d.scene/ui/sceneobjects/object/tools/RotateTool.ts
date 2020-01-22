/// <reference path="./BaseObjectTool.ts" />

namespace phasereditor2d.scene.ui.sceneobjects {

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
    }
}