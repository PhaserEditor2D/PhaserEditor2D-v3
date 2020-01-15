namespace phasereditor2d.scene.ui.sceneobjects {

    export class ChangeTextureOperation extends SceneObjectOperation<ITextureLikeObject> {

        constructor(editor: editor.SceneEditor, objects: ITextureLikeObject[], value: TextureKeys) {
            super(editor, objects, value);
        }

        getValue(obj: ITextureLikeObject): TextureKeys {

            const comp = obj.getEditorSupport().getComponent(TextureComponent) as TextureComponent;

            return comp.getTextureKeys();
        }

        setValue(obj: ITextureLikeObject, value: TextureKeys): void {

            const finder = this.getEditor().getPackFinder();

            const item = finder.findAssetPackItem(value.key);

            if (item) {

                item.addToPhaserCache(this.getEditor().getGame(), this.getScene().getPackCache());
            }

            const comp = obj.getEditorSupport().getComponent(TextureComponent) as TextureComponent;

            comp.setTextureKeys(value);

            this.getEditor().repaint();
            this.getEditor().setSelection(this.getEditor().getSelection());
        }
    }
}