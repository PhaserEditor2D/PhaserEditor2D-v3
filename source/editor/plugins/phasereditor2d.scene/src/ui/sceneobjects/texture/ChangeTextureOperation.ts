namespace phasereditor2d.scene.ui.sceneobjects {

    export class ChangeTextureOperation extends SceneGameObjectOperation<ITextureLikeObject> {

        static canChangeTextureOf(obj: ISceneGameObject) {

            return GameObjectEditorSupport.hasObjectComponent(obj, TextureComponent)
                && (!obj.getEditorSupport().isPrefabInstance()
                    || obj.getEditorSupport().isUnlockedProperty(TextureComponent.texture))
        }

        static async runDialog(editor: editor.SceneEditor, atlasKey?: string) {

            const cache = editor.getScene().getPackCache();

            const lockedObjects = editor.getSelectedGameObjects().filter(obj => obj.getEditorSupport().isLockedProperty(TextureComponent.texture));

            if (lockedObjects.length > 0) {

                const ok = await editor.confirmUnlockProperty([TextureComponent.texture], "texture", TextureSection.SECTION_ID);

                if (!ok) {

                    return;
                }
            }

            const objects = editor.getSelectedGameObjects().filter(obj => this.canChangeTextureOf(obj));

            const objectKeys = objects

                .map(obj => GameObjectEditorSupport.getObjectComponent(obj, TextureComponent) as TextureComponent)

                .map(comp => comp.getTextureKeys());

            const selectedFrames = objectKeys.map(k => cache.getImage(k.key, k.frame));

            const callback = async (sel) => {

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
            };

            if (atlasKey) {

                TextureFrameSelectionDialog.createDialog(
                    editor.getPackFinder(),
                    selectedFrames as (pack.core.AssetPackImageFrame)[],
                    callback,
                    atlasKey);

            } else {

                TextureSelectionDialog.createDialog(
                    editor,
                    selectedFrames as (pack.core.AssetPackImageFrame)[],
                    callback);
            }
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