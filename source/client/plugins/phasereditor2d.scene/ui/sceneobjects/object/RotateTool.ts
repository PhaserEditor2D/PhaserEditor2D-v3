namespace phasereditor2d.scene.ui.sceneobjects {

    export class RotateTool extends editor.tools.SceneTool {

        static ID = "phasereditor2d.scene.ui.sceneobjects.RotateTool";

        constructor() {
            super(RotateTool.ID);

            this.addItems(
                new RotateLineToolItem(true),
                new RotateLineToolItem(false),
                new editor.tools.CenterPointToolItem(RotateToolItem.COLOR),
                new RotateToolItem()
            );
        }

        canEdit(obj: unknown): boolean {

            return obj instanceof Phaser.GameObjects.GameObject
                && (obj as unknown as ISceneObject).getEditorSupport().hasComponent(TransformComponent);
        }
    }
}