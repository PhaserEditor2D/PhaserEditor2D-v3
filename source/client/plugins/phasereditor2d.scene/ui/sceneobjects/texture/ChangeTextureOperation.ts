namespace phasereditor2d.scene.ui.sceneobjects {

    export class ChangeTextureOperation extends SceneObjectOperation<ITextureLike> {

        constructor(editor: editor.SceneEditor, objects: ITextureLike[], value: TextureKeyFrame) {
            super(editor, objects, value);
        }

        getValue(obj: ITextureLike): TextureKeyFrame {

            const comp = obj.getEditorSupport().getComponent(TextureComponent) as TextureComponent;

            return comp.getTexture();
        }

        setValue(obj: ITextureLike, value: TextureKeyFrame): void {

            const finder = this.getEditor().getPackFinder();

            const item = finder.findAssetPackItem(value.textureKey);

            if (item) {

                item.addToPhaserCache(this.getEditor().getGame(), this.getScene().getPackCache());
            }

            const comp = obj.getEditorSupport().getComponent(TextureComponent) as TextureComponent;

            comp.setTexture(value.textureKey, value.frameKey);

            this.getEditor().repaint();
            this.getEditor().setSelection(this.getEditor().getSelection());
        }
    }
}