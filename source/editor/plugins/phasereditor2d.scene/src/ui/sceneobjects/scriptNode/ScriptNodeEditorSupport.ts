namespace phasereditor2d.scene.ui.sceneobjects {

    import controls = colibri.ui.controls;

    export class ScriptNodeEditorSupport extends GameObjectEditorSupport<ScriptNode> {

        static DEFAULT_PARENT_VARIABLE_TYPES = ["ScriptNode", "Phaser.GameObjects.GameObject", "Phaser.Scene"];

        constructor(scene: Scene, obj: ScriptNode) {
            super(ScriptNodeExtension.getInstance(), obj, scene);
        }

        destroy(): boolean | void {
            
            this.getObject().removeFromParent();

            super.destroy();
        }

        isDisplayObject(): boolean {

            return false;
        }

        setInteractive(): void {
            // nothing
        }

        getCellRenderer(): colibri.ui.controls.viewers.ICellRenderer {

            return new controls.viewers.IconImageCellRenderer(resources.getIcon(resources.ICON_BUILD));
        }

        getObjectParent(): ISceneGameObject {
            
            const parent = this.getObject().getParent();

            if (isGameObject(parent)) {

                return parent as ISceneGameObject;
            }

            return undefined;
        }
    }
}