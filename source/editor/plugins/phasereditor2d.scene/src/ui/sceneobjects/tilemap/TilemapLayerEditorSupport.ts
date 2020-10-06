namespace phasereditor2d.scene.ui.sceneobjects {

    export class TilemapLayerEditorSupport extends GameObjectEditorSupport<TilemapLayer> {

        constructor(obj: TilemapLayer, scene: Scene) {
            super(TilemapLayerExtension.getInstance(), obj, scene);

            this.addComponent(

                new TransformComponent(obj as unknown as ITransformLikeObject),
                new VisibleComponent(obj as unknown as IVisibleLikeObject),
            );
        }

        setInteractive(): void {

            //
        }

        getCellRenderer(): colibri.ui.controls.viewers.ICellRenderer {

            return new colibri.ui.controls.viewers.EmptyCellRenderer();
        }

    }
}