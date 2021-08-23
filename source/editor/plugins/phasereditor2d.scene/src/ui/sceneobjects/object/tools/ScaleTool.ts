/// <reference path="./BaseObjectTool.ts" />

namespace phasereditor2d.scene.ui.sceneobjects {

    export class ScaleTool extends BaseObjectTool {

        static ID = "phasereditor2d.scene.ui.sceneobjects.ScaleTool";

        constructor() {
            super({
                id: ScaleTool.ID,
                command: editor.commands.CMD_SCALE_SCENE_OBJECT,
            }, TransformComponent.scaleX, TransformComponent.scaleY);

            this.addItems(
                new ScaleToolItem(1, 0.5),
                new ScaleToolItem(1, 1),
                new ScaleToolItem(0.5, 1),
            );
        }

        onActivated(args: editor.tools.ISceneToolContextArgs) {

            super.onActivated(args);

            this.confirmUnlockProperty(args, [sceneobjects.TransformComponent.scale.x, sceneobjects.TransformComponent.scale.y],
                "scale", TransformSection.SECTION_ID);
        }
    }
}