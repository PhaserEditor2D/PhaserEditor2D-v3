namespace phasereditor2d.scene.ui.sceneobjects {

    import controls = colibri.ui.controls;

    export class FXObjectEditorSupport<T extends FXObject> extends GameObjectEditorSupport<T> {

        constructor(extension: FXObjectExtension, obj: T, scene: Scene) {
            super(extension, obj, scene);
        }

        destroy(): boolean | void {

            const obj = this.getObject();

            obj.removeFX();

            obj.removeFromParent();

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

            return parent;
        }

        writeJSON(data: IFXObjectData): void {

            super.writeJSON(data);

            data.preFX = this.getObject().isPreFX() || undefined;
        }
    }
}