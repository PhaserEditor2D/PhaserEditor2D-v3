namespace phasereditor2d.scene.ui.sceneobjects {

    import controls = colibri.ui.controls;

    export class FXObjectEditorSupport<T extends FXObject> extends GameObjectEditorSupport<T> {

        private _cellRenderer: controls.viewers.ICellRenderer;

        constructor(extension: FXObjectExtension, obj: T, scene: Scene) {
            super(extension, obj, scene);
        }

        static syncEffectsOrder(obj: ISceneGameObject) {

            const sprite = obj as unknown as Phaser.GameObjects.Image;

            const objES = obj.getEditorSupport();

            const data: any = {};
            objES.writeJSON(data);
            objES.readJSON(data);

            // const preFXs = objES.getObjectChildren()
            //     .filter(obj => obj instanceof FXObject && obj.isPreFX())
            //     .map((obj: FXObject) => obj.getPhaserFX());

            // const postFXs = objES.getObjectChildren()
            //     .filter(obj => obj instanceof FXObject && !obj.isPreFX())
            //     .map((obj: FXObject) => obj.getPhaserFX());

            // if (sprite.preFX) {

            //     sprite.preFX.clear();

            //     for (const fx of preFXs) {

            //         sprite.preFX.add(fx);
            //     }
            // }

            // sprite.postFX.clear();

            // for (const fx of postFXs) {

            //     sprite.postFX.add(fx);
            // }
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

            if (!this._cellRenderer) {

                this._cellRenderer = new controls.viewers.IconImageCellRenderer(resources.getIcon(resources.ICON_FX));
            }

            return this._cellRenderer;
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