namespace phasereditor2d.scene.ui.sceneobjects {

    export class ChangeTextureOperation extends SceneObjectOperation<ITextureLikeObject> {

        constructor(editor: editor.SceneEditor, objects: ITextureLikeObject[], value: ITextureKeys) {
            super(editor, objects, value);
        }

        getValue(obj: ITextureLikeObject): ITextureKeys {

            const comp = obj.getEditorSupport().getComponent(TextureComponent) as TextureComponent;

            return comp.getTextureKeys();
        }

        setValue(obj: ITextureLikeObject, value: ITextureKeys): void {

            const finder = this.getEditor().getPackFinder();

            const item = finder.findAssetPackItem(value.key);

            if (item) {

                item.addToPhaserCache(this.getEditor().getGame(), this.getScene().getPackCache());
            }

            const comp = obj.getEditorSupport().getComponent(TextureComponent) as TextureComponent;

            comp.setTextureKeys(value);

            const editor = this.getEditor();

            editor.refreshDependenciesHash();

            editor.dispatchSelectionChanged();

            editor.repaint();
        }
    }
}