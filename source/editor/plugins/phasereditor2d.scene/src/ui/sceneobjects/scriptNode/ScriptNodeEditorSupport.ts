namespace phasereditor2d.scene.ui.sceneobjects {

    import controls = colibri.ui.controls;

    export class ScriptNodeEditorSupport extends GameObjectEditorSupport<ScriptNode> {

        constructor(scene: Scene, obj: ScriptNode) {
            super(ScriptNodeExtension.getInstance(), obj, scene);
        }

        isDisplayObject(): boolean {

            return false;
        }

        setInteractive(): void {
            // nothing
        }

        getCellRenderer(): colibri.ui.controls.viewers.ICellRenderer {

            return new controls.viewers.IconImageCellRenderer(ScenePlugin.getInstance().getIcon(ICON_BUILD));
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