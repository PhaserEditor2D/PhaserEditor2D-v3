namespace phasereditor2d.scene.ui.sceneobjects {

    export class ScaleTool extends editor.tools.SceneTool {

        static ID = "phasereditor2d.scene.ui.sceneobjects.ScaleTool";

        constructor() {
            super(ScaleTool.ID);

            this.addItems(
                new ScaleToolItem(1, 0.5),
                new ScaleToolItem(1, 1),
                new ScaleToolItem(0.5, 1),
            );
        }

        canEdit(obj: unknown): boolean {
            return obj instanceof Phaser.GameObjects.GameObject
                && (obj as unknown as ISceneObject).getEditorSupport().hasComponent(TransformComponent);
        }

    }
}