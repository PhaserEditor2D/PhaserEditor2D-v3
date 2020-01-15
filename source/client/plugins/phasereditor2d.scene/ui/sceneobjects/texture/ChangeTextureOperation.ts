namespace phasereditor2d.scene.ui.sceneobjects {

    export class ChangeTextureOperation extends SceneObjectOperation<ITextureLikeObject> {

        constructor(editor: editor.SceneEditor, objects: ITextureLikeObject[], value: TextureKeyFrame) {
            super(editor, objects, value);
        }

        getValue(obj: ITextureLikeObject): TextureKeyFrame {

            const comp = obj.getEditorSupport().getComponent(TextureComponent) as TextureComponent;

            return comp.getTexture();
        }

        setValue(obj: ITextureLikeObject, value: TextureKeyFrame): void {

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