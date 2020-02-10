namespace phasereditor2d.scene.ui.sceneobjects {

    import controls = colibri.ui.controls;

    export class TextEditorSupport extends EditorSupport<Text> {

        constructor(obj: Text, scene: Scene) {
            super(TextExtension.getInstance(), obj, scene);

            this.addComponent(

                new TransformComponent(obj as unknown as ITransformLikeObject),
                new OriginComponent(obj as unknown as IOriginLikeObject),
                new FlipComponent(obj as unknown as IFlipLikeObject),
                new TextContentComponent(obj as unknown as ITextContentLikeObject),
            );
        }

        getCellRenderer(): colibri.ui.controls.viewers.ICellRenderer {

            return new controls.viewers.EmptyCellRenderer();
        }

        setInteractive(): void {

            this.getObject().setInteractive();
        }

    }
}