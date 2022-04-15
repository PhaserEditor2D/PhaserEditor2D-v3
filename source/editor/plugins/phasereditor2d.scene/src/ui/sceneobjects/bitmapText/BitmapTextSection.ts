namespace phasereditor2d.scene.ui.sceneobjects {

    import controls = colibri.ui.controls;

    export class BitmapTextSection extends SceneGameObjectSection<BitmapText> {

        constructor(page: controls.properties.PropertyPage) {
            super(page, "phasereditor.scene.ui.sceneobjects.BitmapTextSection", "Bitmap Text");
        }

        getSectionHelpPath() {

            return "scene-editor/bitmap-text-object.html";
        }

        createForm(parent: HTMLDivElement) {

            const comp = this.createGridElement(parent);
            comp.style.gridTemplateColumns = "auto auto 1fr";

            {
                // font
                this.createLock(comp, BitmapTextComponent.font);

                this.createLabel(comp, BitmapTextComponent.font.label, PhaserHelp(BitmapTextComponent.font.tooltip));

                const btn = this.createButton(comp, "", async () => {

                    const input = this.getEditor().getPackFinder().getPacks()
                        .flatMap(pack => pack.getItems())
                        .filter(item => item instanceof pack.core.BitmapFontAssetPackItem);

                    const dlg = new pack.ui.dialogs.AssetSelectionDialog();

                    dlg.create();
                    dlg.setTitle("Select Bitmap Font");
                    dlg.getViewer().setCellSize(128, true);
                    dlg.getViewer().setInput(input);
                    dlg.getViewer().repaint();
                    dlg.setSelectionCallback(async (sel) => {

                        const item = sel[0] as pack.core.BitmapFontAssetPackItem;

                        await item.preload();

                        await item.preloadImages();

                        item.addToPhaserCache(this.getEditor().getGame(), this.getEditor().getScene().getPackCache());

                        this.getUndoManager().add(
                            new SimpleOperation(
                                this.getEditor(), this.getSelection(), BitmapTextComponent.font, item.getKey()));
                    });
                });

                this.addUpdater(() => {

                    if (this.getSelection().length !== 1) {

                        btn.textContent = this.getSelection().length + " selected";

                    } else {

                        btn.textContent = this.getSelectionFirstElement().font;
                    }
                });
            }

            this.createPropertyFloatRow(comp, BitmapTextComponent.fontSize);

            this.createPropertyEnumRow(comp, BitmapTextComponent.align);

            this.createPropertyFloatRow(comp, BitmapTextComponent.letterSpacing);

            this.createPropertyFloatRow(comp, BitmapTextComponent.maxWidth);

            this.createPropertyFloatRow(comp, BitmapTextComponent.dropShadowX);

            this.createPropertyFloatRow(comp, BitmapTextComponent.dropShadowY);

            this.createPropertyFloatRow(comp, BitmapTextComponent.dropShadowAlpha);

            this.createPropertyColorRow(comp, BitmapTextComponent.dropShadowColor);
        }

        canEdit(obj: any, n: number): boolean {

            return obj instanceof BitmapText;
        }

        canEditNumber(n: number): boolean {

            return n > 0;
        }
    }
}