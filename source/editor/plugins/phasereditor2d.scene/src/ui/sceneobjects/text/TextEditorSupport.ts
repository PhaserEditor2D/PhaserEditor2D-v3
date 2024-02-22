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
                new ArcadeComponent(obj, false),
                new TextContentComponent(obj),
                new TextComponent(obj)
            );
        }

        computeContentHash() {

            return this.computeContentHashWithComponent(this.getObject(),
                FlipComponent,
                TintComponent,
                TextContentComponent,
                TextComponent
            );
        }

        getCellRenderer(): colibri.ui.controls.viewers.ICellRenderer {
            
            return new TextCellRenderer();
        }

        setInteractive(): void {

            this.getObject().setInteractive();
        }

        getPropertyDefaultValue(prop: IProperty<any>) {

            if (prop === OriginComponent.originX || prop === OriginComponent.originY) {

                return 0;
            }

            return super.getPropertyDefaultValue(prop);
        }
    }
}