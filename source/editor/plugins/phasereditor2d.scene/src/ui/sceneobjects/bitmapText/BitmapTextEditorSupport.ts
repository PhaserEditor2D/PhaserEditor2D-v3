namespace phasereditor2d.scene.ui.sceneobjects {

    export class BitmapTextEditorSupport extends GameObjectEditorSupport<BitmapText> {

        constructor(obj: BitmapText, scene: Scene) {
            super(BitmapTextExtension.getInstance(), obj, scene);

            this.addComponent(

                new TransformComponent(obj),
                new OriginComponent(obj),
                new VisibleComponent(obj),
                new AlphaComponent(obj),
                new TintComponent(obj),
                new TextContentComponent(obj),
                new BitmapTextComponent(obj)
            );
        }

        computeContentHash() {

            const obj = this.getObject();

            return this.computeContentHashWithComponent(obj,
                TintComponent,
                TextContentComponent,
                BitmapTextComponent);
        }

        getCellRenderer(): colibri.ui.controls.viewers.ICellRenderer {

            return new ObjectCellRenderer();
        }

        setInteractive(): void {

            this.getObject().setInteractive(interactive_getAlpha_RenderTexture);
        }
    }
}