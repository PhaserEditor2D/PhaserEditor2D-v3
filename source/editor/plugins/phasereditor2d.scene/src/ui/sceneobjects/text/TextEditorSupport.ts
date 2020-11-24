namespace phasereditor2d.scene.ui.sceneobjects {

    export class TextEditorSupport extends GameObjectEditorSupport<Text> {

        constructor(obj: Text, scene: Scene) {
            super(TextExtension.getInstance(), obj, scene);

            this.addComponent(

                new TransformComponent(obj),
                new OriginComponent(obj),
                new FlipComponent(obj),
                new VisibleComponent(obj),
                new AlphaComponent(obj),
                new TintComponent(obj),
                new TextContentComponent(obj),
                new TextComponent(obj)
            );
        }

        computeContentHash() {

            const obj = this.getObject();

            const hash = JSON.stringify({
                text: obj.text,
                style: obj.style.toJSON(),
                flip: obj.flipX + "," + obj.flipY,
                tint: obj.tint,
                angle: obj.angle
            });

            return hash;
        }

        getCellRenderer(): colibri.ui.controls.viewers.ICellRenderer {

            return new ObjectCellRenderer();
        }

        setInteractive(): void {

            this.getObject().setInteractive();
        }
    }
}