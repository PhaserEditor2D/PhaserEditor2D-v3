namespace phasereditor2d.scene.ui.sceneobjects {

    export class ChangeTextureOperation extends SceneGameObjectOperation<ITextureLikeObject> {

        static runDialog(editor: editor.SceneEditor) {

            const finder = editor.getPackFinder();

            const cache = editor.getScene().getPackCache();

            const objects = editor.getSelectedGameObjects()

                .filter(obj => GameObjectEditorSupport.hasObjectComponent(obj, TextureComponent))

                .filter(obj => !obj.getEditorSupport().isPrefabInstance()
                    || obj.getEditorSupport().isUnlockedProperty(TextureComponent.texture));

            const objectKeys = objects

                .map(obj => GameObjectEditorSupport.getObjectComponent(obj, TextureComponent) as TextureComponent)

                .map(comp => comp.getTextureKeys());

            const selectedFrames = objectKeys.map(k => cache.getImage(k.key, k.frame));

            TextureSelectionDialog.createDialog(
                finder,
                selectedFrames as pack.core.AssetPackImageFrame[],
                async (sel) => {

                    const frame = sel[0];

                    let newKeys: ITextureKeys;

                    const item = frame.getPackItem();

                    item.addToPhaserCache(editor.getGame(), cache);

                    if (item instanceof pack.core.ImageAssetPackItem) {

                        newKeys = { key: item.getKey() };

                    } else {

                        newKeys = { key: item.getKey(), frame: frame.getName() };
                    }

                    editor
                        .getUndoManager().add(new ChangeTextureOperation(
                            editor,
                            objects as ITextureLikeObject[],
                            newKeys)
                        );
                });
        }

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