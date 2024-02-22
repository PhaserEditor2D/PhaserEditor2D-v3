namespace phasereditor2d.scene.ui.sceneobjects {

    import controls = colibri.ui.controls;
    import ide = colibri.ui.ide;

    export class TextureSection extends SceneGameObjectSection<ITextureLikeObject> {
        static SECTION_ID = "phasereditor2d.scene.ui.sceneobjects.TextureSection";

        constructor(page: controls.properties.PropertyPage) {
            super(page, TextureSection.SECTION_ID, "Texture", false, false);
        }

        getSectionHelpPath() {

            return "scene-editor/texture-property.html";
        }

        createMenu(menu: controls.Menu) {

            this.getEditor().getMenuCreator().createTextureMenuItems(menu);

            menu.addSeparator();

            super.createMenu(menu);
        }

        createForm(parent: HTMLDivElement) {

            const comp = this.createGridElement(parent);
            comp.style.gridTemplateColumns = "auto 1fr auto";

            // Preview

            const imgComp = document.createElement("div");
            imgComp.style.gridColumn = "1/ span 3";
            imgComp.style.height = "200px";
            comp.appendChild(imgComp);

            const imgControl = new controls.ImageControl(ide.IMG_SECTION_PADDING);
            imgControl.getElement().style.position = "relative";

            this.getPage().eventControlLayout.addListener(() => {

                imgControl.resizeTo();
            });

            imgComp.appendChild(imgControl.getElement());

            requestAnimationFrame(() => imgControl.resizeTo());

            this.addUpdater(async () => {

                const frames = this.getSelectedFrames();

                imgControl.setImage(new controls.MultiImage(frames, 10, 10));

                requestAnimationFrame(() => imgControl.resizeTo());
            });

            {
                // Size

                const label = this.createLabel(comp);
                label.style.gridColumn = "1 / span 3";
                label.style.justifySelf = "center";

                this.addUpdater(() => {

                    const frames = this.getSelectedFrames();

                    if (frames.length === 1) {

                        const frame = frames[0];
                        label.innerHTML = frame.getWidth() + "x" + frame.getHeight();

                    } else {

                        label.innerHTML = "";
                    }
                });
            }

            {
                // Lock

                this.createLock(comp, TextureComponent.texture);
            }

            {
                // Buttons

                const changeBtn = this.createButton(comp, "Select", e => {

                    ChangeTextureOperation.runDialog(this.getEditor());
                });

                controls.Tooltip.tooltip(changeBtn, "Click to select a new texture.");

                const deleteBtn = this.createButton(comp, "Delete", e => {

                    this.getEditor().getUndoManager()
                        .add(new ChangeTextureOperation(this.getEditor(), this.getSelection(), {}));
                });

                controls.Tooltip.tooltip(deleteBtn, "Removes the texture of the object.");

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

            const cache = this.getEditor().getScene().getPackCache();

            const images = new Set<pack.core.AssetPackImageFrame>();

            for (const obj of this.getSelection()) {

                const textureComp = this.getTextureComponent(obj);

                const { key, frame } = textureComp.getTextureKeys();

                const img = cache.getImage(key, frame);

                if (img) {

                    images.add(img as pack.core.AssetPackImageFrame);
                }
            }

            return [...images];
        }

        getTextureComponent(obj: ITextureLikeObject) {
            
            return obj.getEditorSupport().getComponent(TextureComponent) as TextureComponent;
        }

        canEdit(obj: any, n: number): boolean {
            
            return GameObjectEditorSupport.hasObjectComponent(obj, TextureComponent);
        }

        canEditNumber(n: number): boolean {

            return n > 0;
        }
    }
}