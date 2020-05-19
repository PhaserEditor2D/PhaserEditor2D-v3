namespace phasereditor2d.scene.ui.sceneobjects {

    export class OriginTool extends BaseObjectTool {

        static ID = "phasereditor2d.scene.ui.sceneobjects.OriginTool";

        constructor() {
            super({
                id: OriginTool.ID,
                command: editor.commands.CMD_SET_ORIGIN_SCENE_OBJECT,
            }, OriginComponent.originX, OriginComponent.originY);

            // const x = new TranslateToolItem("x");
            // const y = new TranslateToolItem("y");
            // const xy = new TranslateToolItem("xy");

            // this.addItems(
            //     new editor.tools.LineToolItem("#f00", xy, x),
            //     new editor.tools.LineToolItem("#0f0", xy, y),
            //     xy,
            //     x,
            //     y
            // );
        }
    }
}