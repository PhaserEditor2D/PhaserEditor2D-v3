namespace phasereditor2d.scene.ui.sceneobjects {

    import controls = colibri.ui.controls;

    export class SpriteAnimationSection extends SceneGameObjectSection<Sprite> {

        constructor(page: controls.properties.PropertyPage) {
            super(page, "phasereditor2d.scene.ui.sceneobjects.SpriteAnimationSection", "Animation");
        }

        protected getSectionHelpPath() {

            return "scene-editor/animations-properties.html";
        }

        createMenu(menu: controls.Menu): void {

            menu.addAction({
                text: "Open Animation File",
                callback: async () => {

                    const sprite = this.getSelectionFirstElement();

                    const finder = new pack.core.PackFinder();

                    await finder.preload();

                    const anim = finder.findAnimationByKey(sprite.animationKey);

                    if (anim) {

                        ScenePlugin.getInstance().openAnimationInEditor(anim);
                    }
                }
            });

            super.createMenu(menu);
        }

        createForm(parent: HTMLDivElement) {

            const comp = this.createGridElement(parent, 4);
            comp.style.gridTemplateColumns = "auto auto 1fr auto";

            {
                const btn = this.createPropertyEnumRow(comp, SpriteComponent.animationPlayMethod);
                btn.style.gridColumn = "3 / span 2";
            }

            const animationToolbar = document.createElement("div");
            animationToolbar.style.display = "flex";
            animationToolbar.style.gap = "5px";

            // play animation

            this.createPropertyStringRow(comp, SpriteComponent.animationKey);

            comp.appendChild(animationToolbar);

            this.createAnimationKeyDialogButton(comp, animationToolbar);

            this.createPreviewDialogButton(animationToolbar);

            // enable config
            this.createPropertyBoolean(comp, SpriteComponent.animationCustomConfig);
        }

        private createPreviewDialogButton(animationToolbar: HTMLDivElement) {

            const btn = this.createButton(animationToolbar, resources.getIcon(resources.ICON_PLAY), async () => {

                const sprite = this.getSelectionFirstElement();

                const finder = new pack.core.PackFinder();

                await finder.preload();

                const anim = finder.findAnimationByKey(sprite.animationKey);

                if (anim) {

                    const config: Phaser.Types.Animations.PlayAnimationConfig = {
                        key: anim.getKey()
                    };

                    if (sprite.animationCustomConfig) {

                        SpriteComponent.buildPlayConfig(sprite, config);
                    }

                    const dlg = new AnimationPreviewDialog(anim.getParent(), config);

                    dlg.create();

                } else {

                    alert("Animation not found.");
                }
            });

            btn.style.gridColumn = "1 / span 4";
        }

        private createAnimationKeyDialogButton(comp: HTMLDivElement, animationToolbar: HTMLDivElement) {

            const btnUI = this.createButtonDialog({
                dialogTittle: "Select Animation Key",
                createDialogViewer: async (revealValue: string) => {

                    const viewer = new controls.viewers.TreeViewer("phasereditor2d.scene.ui.sceneobjects.AnimationSection." + this.getId());

                    viewer.setCellRendererProvider(new controls.viewers.EmptyCellRendererProvider(e => new pack.ui.viewers.AnimationConfigCellRenderer()));
                    viewer.setLabelProvider(new pack.ui.viewers.AssetPackLabelProvider());
                    viewer.setTreeRenderer(new controls.viewers.TreeViewerRenderer(viewer));
                    viewer.setContentProvider(new controls.viewers.ArrayTreeContentProvider());

                    const finder = new pack.core.PackFinder();
                    await finder.preload();

                    const animations = finder
                        .getAssets(i => i instanceof pack.core.BaseAnimationsAssetPackItem)
                        .flatMap((i: pack.core.BaseAnimationsAssetPackItem) => i.getAnimations());

                    viewer.setInput(animations);

                    viewer.revealAndSelect(animations.find(a => a.getKey() === revealValue));

                    return viewer;
                },
                getValue: () => {

                    return this.getSelection()[0].animationKey || "";
                },
                onValueSelected: (value: string) => {

                    this.getEditor().getUndoManager().add(
                        new SimpleOperation(this.getEditor(), this.getSelection(), SpriteComponent.animationKey, value));
                },
                dialogElementToString: (viewer: controls.viewers.TreeViewer, value: pack.core.AnimationConfigInPackItem): string => {

                    return value.getKey();
                },
                updateIconCallback: async (iconControl, value) => {

                    const finder = new pack.core.PackFinder();

                    await finder.preload();

                    const image = AnimationKeyPropertyType.getAnimationIcon(finder, value);

                    iconControl.setIcon(image);
                },
            });

            animationToolbar.appendChild(btnUI.buttonElement);

            this.addUpdater(() => {

                btnUI.buttonElement.disabled = this.getSelection()
                    .filter(sprite => !sprite.getEditorSupport()
                        .isUnlockedProperty(SpriteComponent.animationKey))
                    .length > 0;

                btnUI.updateDialogButtonIcon();
            });
        }

        canEdit(obj: any, n: number): boolean {

            return obj instanceof Sprite;
        }

        canEditNumber(n: number): boolean {

            return n > 0;
        }
    }
}