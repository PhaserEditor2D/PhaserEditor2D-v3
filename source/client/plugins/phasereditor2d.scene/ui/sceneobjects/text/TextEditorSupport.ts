namespace phasereditor2d.scene.ui.sceneobjects {

    import controls = colibri.ui.controls;

    export class TextEditorSupport extends EditorSupport<Text> {

        constructor(obj: Text, scene: Scene) {
            super(TextExtension.getInstance(), obj, scene);

            this.addComponent(

                new TransformComponent(obj),
                new OriginComponent(obj),
                new FlipComponent(obj),
                new TextContentComponent(obj),
                new TextComponent(obj)
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