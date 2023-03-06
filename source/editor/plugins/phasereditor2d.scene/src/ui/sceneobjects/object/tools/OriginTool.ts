namespace phasereditor2d.scene.ui.sceneobjects {

    export class OriginTool extends BaseObjectTool {

        static ID = "phasereditor2d.scene.ui.sceneobjects.OriginTool";

        constructor() {
            super({
                id: OriginTool.ID,
                command: editor.commands.CMD_SET_ORIGIN_SCENE_OBJECT,
            });

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

        protected getProperties(obj: ISceneGameObject) {

            return obj.getEditorSupport().getOriginProperties();
        }

        canEdit(obj: ISceneGameObject) {

            if (obj instanceof Container) {

                const objES = obj.getEditorSupport();

                if (objES.isPrefabInstance()) {

                    for (const test of [obj, ...objES.getObjectChildren()]) {

                        if (!test.getEditorSupport().isUnlockedPropertyXY(TransformComponent.position)) {

                            return false;
                        }
                    }
                }

                return true;
            }

            return super.canEdit(obj);
        }

        canRender(obj: ISceneGameObject) {

            if (obj instanceof Container) {

                return true;
            }

            return super.canRender(obj);
        }

        onActivated(args: editor.tools.ISceneToolContextArgs) {

            super.onActivated(args);

            const props = args.objects.flatMap(obj => obj.getEditorSupport().getOriginProperties());

            const sections = args.objects.flatMap(obj => obj.getEditorSupport().getOriginSectionId());

            this.confirmUnlockProperty(args, props, "origin", ...sections);
        }
    }
}