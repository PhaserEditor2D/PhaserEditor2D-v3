namespace phasereditor2d.scene.ui.sceneobjects {

    import controls = colibri.ui.controls;
    import ide = colibri.ui.ide;
    import core = colibri.core;

    export class TextureSection extends ObjectSceneSection<ITextureLikeObject> {

        constructor(page: controls.properties.PropertyPage) {
            super(page, "phasereditor2d.scene.ui.sceneobjects.TextureSection", "Texture");
        }

        protected createForm(parent: HTMLDivElement) {

            const comp = this.createGridElement(parent);
            comp.style.gridTemplateColumns = "auto 1fr auto";

            // Preview

            const imgComp = document.createElement("div");
            imgComp.style.gridColumn = "1/ span 3";
            imgComp.style.height = "200px";
            comp.appendChild(imgComp);

            const imgControl = new controls.ImageControl(ide.IMG_SECTION_PADDING);

            this.getPage().addEventListener(controls.EVENT_CONTROL_LAYOUT, (e: CustomEvent) => {

                setTimeout(() => imgControl.resizeTo(), 1);
            });

            imgComp.appendChild(imgControl.getElement());

            this.addUpdater(async () => {

                const frames = this.getSelectedFrames();

                imgControl.setImage(new controls.MultiImage(frames, 10, 10));

                setTimeout(() => imgControl.resizeTo(), 1);
            });

            // Lock

            this.createLock(comp, TextureComponent.texture);

            // Buttons

            {
                const changeBtn = this.createButton(comp, "Select", e => {

                    const finder = this.getEditor().getPackFinder();

                    TextureSelectionDialog.createDialog(finder, this.getSelectedFrames(), async (sel) => {

                        const frame = sel[0];

                        let textureData: TextureKeys;

                        const item = frame.getPackItem();

                        item.addToPhaserCache(
                            this.getEditor().getGame(), this.getEditor().getScene().getPackCache());

                        if (item instanceof pack.core.ImageAssetPackItem) {

                            textureData = { key: item.getKey() };

                        } else {

                            textureData = { key: item.getKey(), frame: frame.getName() };
                        }

                        this.getEditor()

                            .getUndoManager().add(new ChangeTextureOperation(
                                this.getEditor(),
                                this.getSelection(),
                                textureData)
                            );

                        this.getEditor().refreshDependenciesHash();
                    });
                });

                const deleteBtn = this.createButton(comp, "Delete", e => {

                    this.getEditor().getUndoManager()
                        .add(new ChangeTextureOperation(this.getEditor(), this.getSelection(), {}));
                });

                this.addUpdater(() => {

                    if (this.getSelection().length === 1) {

                        const obj = this.getSelection()[0];

                        const textureComp = this.getTextureComponent(obj);

                        const { key, frame } = textureComp.getTextureKeys();

                        let str = "(Select)";

                        if (frame !== undefined) {

                            str = frame + " @ " + key;

                        } else if (key) {

                            str = key;
                        }

                        changeBtn.textContent = str;

                    } else {

                        changeBtn.textContent = "Multiple Textures";
                    }

                    const unlocked = this.isUnlocked(TextureComponent.texture);

                    changeBtn.disabled = !unlocked;
                    deleteBtn.disabled = !unlocked;
                });
            }

        }

        private getSelectedFrames() {

            // this happens when the editor is opened but the scene is not yet created
            if (!this.getEditor().getScene()) {

                return [];
            }

            const finder = this.getEditor().getPackFinder();

            const images = new Set<pack.core.AssetPackImageFrame>();

            for (const obj of this.getSelection()) {

                const textureComp = this.getTextureComponent(obj);

                const { key, frame } = textureComp.getTextureKeys();

                const img = finder.getAssetPackItemImage(key, frame);

                if (img) {

                    images.add(img);
                }
            }

            return [...images];
        }

        getTextureComponent(obj: ITextureLikeObject) {
            return obj.getEditorSupport().getComponent(TextureComponent) as TextureComponent;
        }

        canEdit(obj: any, n: number): boolean {
            return EditorSupport.getObjectComponent(obj, TextureComponent) !== null;
        }

        canEditNumber(n: number): boolean {
            return n > 0;
        }
    }
}