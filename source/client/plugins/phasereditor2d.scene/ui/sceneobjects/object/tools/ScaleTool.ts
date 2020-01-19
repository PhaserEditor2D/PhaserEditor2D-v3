/// <reference path="./BaseObjectTool.ts" />

namespace phasereditor2d.scene.ui.sceneobjects {

    export class ScaleTool extends BaseObjectTool {

        static ID = "phasereditor2d.scene.ui.sceneobjects.ScaleTool";

        constructor() {
            super(ScaleTool.ID, TransformComponent.scaleX, TransformComponent.scaleY);

            this.addItems(
                new ScaleToolItem(1, 0.5),
                new ScaleToolItem(1, 1),
                new ScaleToolItem(0.5, 1),
            );
        }
    }
}