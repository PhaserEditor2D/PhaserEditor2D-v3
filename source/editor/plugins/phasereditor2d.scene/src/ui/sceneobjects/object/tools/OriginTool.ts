namespace phasereditor2d.scene.ui.sceneobjects {

    export class OriginTool extends BaseObjectTool {

        static ID = "phasereditor2d.scene.ui.sceneobjects.OriginTool";

        constructor() {
            super({
                id: OriginTool.ID,
                command: editor.commands.CMD_SET_ORIGIN_SCENE_OBJECT,
            }, OriginComponent.originX, OriginComponent.originY);

            const x = new OriginToolItem("x");
            const y = new OriginToolItem("y");
            const xy = new OriginToolItem("xy");

            const containerX = new ContainerOriginToolItem("x");
            const containerY = new ContainerOriginToolItem("y");
            const containerXY = new ContainerOriginToolItem("xy");

            this.addItems(
                new editor.tools.LineToolItem("#f00", xy, x),
                new editor.tools.LineToolItem("#0f0", xy, y),
                xy,
                x,
                y,
                new editor.tools.LineToolItem("#f00", containerXY, containerX),
                new editor.tools.LineToolItem("#0f0", containerXY, containerY),
                containerXY,
                containerX,
                containerY
            );
        }

        canEdit(obj: ISceneObject) {

            return obj.getEditorSupport().hasComponent(OriginComponent)
                || obj instanceof Container;
        }

        canRender(obj: ISceneObject) {

            if (obj instanceof Container) {

                return !obj.getEditorSupport().isPrefabInstance();
            }

            return super.canEdit(obj);
        }
    }
}