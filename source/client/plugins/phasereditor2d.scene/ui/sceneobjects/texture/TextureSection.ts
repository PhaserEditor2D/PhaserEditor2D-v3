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
            comp.style.gridTemplateColumns = "1fr auto";

            // Preview

            const imgComp = document.createElement("div");
            imgComp.style.gridColumn = "1/ span 2";
            imgComp.style.height = "200px";
            comp.appendChild(imgComp);

            const imgControl = new controls.ImageControl(ide.IMG_SECTION_PADDING);

            this.getPage().addEventListener(controls.EVENT_CONTROL_LAYOUT, (e: CustomEvent) => {

                setTimeout(() => imgControl.resizeTo(), 1);
            });

            imgComp.appendChild(imgControl.getElement());

            this.addUpdater(async () => {

                const finder = this.getEditor().getPackFinder();

                for (const obj of this.getSelection()) {

                    const textureComp = this.getTextureComponent(obj);

                    const { textureKey, frameKey } = textureComp.getTexture();

                    const img = finder.getAssetPackItemImage(textureKey, frameKey);

                    imgControl.setImage(img);
                }

                setTimeout(() => imgControl.resizeTo(), 1);
            });

            this.createLock(comp);

            // Buttons

            {
                const changeBtn = this.createButton(comp, "Select", e => {

                    const finder = this.getEditor().getPackFinder();

                    TextureSelectionDialog.createDialog(finder, async (sel) => {

                        const frame = sel[0];

                        let textureData: TextureKeyFrame;

                        const item = frame.getPackItem();

                        item.addToPhaserCache(
                            this.getEditor().getGame(), this.getEditor().getScene().getPackCache());

                        if (item instanceof pack.core.ImageAssetPackItem) {

                            textureData = { textureKey: item.getKey() };

                        } else {

                            textureData = { textureKey: item.getKey(), frameKey: frame.getName() };
                        }

                        this.getEditor()

                            .getUndoManager().add(new ChangeTextureOperation(
                                this.getEditor(),
                                this.getSelection(),
                                textureData)
                            );
                    });
                });

                this.addUpdater(() => {

                    if (this.getSelection().length === 1) {

                        const obj = this.getSelection()[0];

                        const textureComp = this.getTextureComponent(obj);

                        const { textureKey, frameKey } = textureComp.getTexture();

                        let str = "(Select)";

                        if (typeof frameKey === "number" || typeof frameKey === "string") {

                            str = frameKey + " @ " + textureKey;

                        } else if (textureKey) {

                            str = textureKey;
                        }

                        changeBtn.textContent = str;

                    } else {

                        changeBtn.textContent = "Multiple Textures";
                    }
                });

                const deleteBtn = this.createButton(comp, "Delete", e => {

                    const obj = this.getSelection()[0];

                    const textureComp = this.getTextureComponent(obj);

                    textureComp.setTexture(null, null);

                    this.getEditor().setDirty(true);

                    this.getEditor().repaint();

                    this.updateWithSelection();
                });
            }

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