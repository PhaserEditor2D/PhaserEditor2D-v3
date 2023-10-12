namespace phasereditor2d.scene.ui.sceneobjects {

    import controls = colibri.ui.controls;

    export class AnimationSection extends SceneGameObjectSection<Sprite> {

        constructor(page: controls.properties.PropertyPage) {
            super(page, "phasereditor2d.scene.ui.sceneobjects.AnimationSection", "Animation");
        }

        protected getSectionHelpPath() {

            return "TODO";
        }

        createForm(parent: HTMLDivElement) {

            const comp = this.createGridElement(parent, 4);
            comp.style.gridTemplateColumns = "auto auto 1fr auto";

            {
                const btn = this.createPropertyEnumRow(comp, SpriteComponent.playMethod);
                btn.style.gridColumn = "3 / span 2";
            }

            {
                // play animation

                this.createPropertyStringRow(comp, SpriteComponent.playAnimation);

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
                            .getAssets(i => i instanceof pack.core.AnimationsAssetPackItem)
                            .flatMap((i: pack.core.AnimationsAssetPackItem) => i.getAnimations());

                        viewer.setInput(animations);

                        viewer.revealAndSelect(animations.find(a => a.getKey() === revealValue));

                        return viewer;
                    },
                    getValue: () => {

                        return this.getSelection()[0].playAnimation || "";
                    },
                    onValueSelected: (value: string) => {

                        this.getEditor().getUndoManager().add(
                            new SimpleOperation(this.getEditor(), this.getSelection(), SpriteComponent.playAnimation, value));
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

                comp.appendChild(btnUI.buttonElement);

                this.addUpdater(() => {

                    btnUI.buttonElement.disabled = this.getSelection()
                        .filter(sprite => !sprite.getEditorSupport()
                            .isUnlockedProperty(SpriteComponent.playAnimation))
                        .length > 0;

                    btnUI.updateDialogButtonIcon();
                });
            }
        }

        canEdit(obj: any, n: number): boolean {

            return obj instanceof Sprite;
        }

        canEditNumber(n: number): boolean {

            return n > 0;
        }
    }
}