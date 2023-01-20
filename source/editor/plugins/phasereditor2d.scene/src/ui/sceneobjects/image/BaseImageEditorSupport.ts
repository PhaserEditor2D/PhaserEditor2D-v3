namespace phasereditor2d.scene.ui.sceneobjects {

    export class BaseImageEditorSupport<T extends ISceneGameObject> extends GameObjectEditorSupport<T> {

        constructor(extension: SceneGameObjectExtension, obj: T, scene: Scene,
            includeTextureComponent = true, includeAlphaComponent = true, includeFlipComponent = true, includeTint = true) {
                
            super(extension, obj, scene);

            if (includeTextureComponent) {

                this.addComponent(new TextureComponent(obj as unknown as ITextureLikeObject));
            }

            if (includeAlphaComponent) {

                this.addComponent(new AlphaComponent(obj as unknown as IAlphaLikeObject));
            }

            if (includeFlipComponent) {

                this.addComponent(new FlipComponent(obj as unknown as IFlipLikeObject));
            }

            if (includeTint) {

                this.addComponent(new TintComponent(obj));
            }

            this.addComponent(
                new TransformComponent(obj as unknown as ITransformLikeObject),
                new OriginComponent(obj as unknown as IOriginLikeObject),
                new VisibleComponent(obj as unknown as IVisibleLikeObject),
                new ArcadeComponent(obj, false)
            );
        }

        getCellRenderer(): colibri.ui.controls.viewers.ICellRenderer {

            return new TextureCellRenderer();
        }

        getTextureComponent() {

            return this.getComponent(TextureComponent) as TextureComponent;
        }

        setInteractive() {

            this.getObject().setInteractive(interactive_getAlpha_SharedTexture);
        }
    }
}