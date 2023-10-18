/// <reference path="../../editor/properties/BaseSceneSection.ts" />
namespace phasereditor2d.scene.ui.codesnippets {

    import controls = colibri.ui.controls;

    export class CreateFromAsepriteCodeSnippetSection extends ui.editor.properties.BaseSceneSection<CreateFromAsepriteCodeSnippet> {

        constructor(page: controls.properties.PropertyPage) {
            super(page, "phasereditor2d.scene.ui.codesnippets.CreateFromAsepriteCodeSnippetSection", "Create From Aseprite")
        }

        createForm(parent: HTMLDivElement): void {

            const comp = this.createGridElement(parent, 3);
            comp.style.gridTemplateColumns = "auto 1fr auto";

            this.createLabel(comp, "Aseprite File Key", "The Aseprite animations file key.");

            { 
                const text = this.createText(comp, false);
                
                this.addUpdater(() => {

                    text.value = this.getSelectionFirstElement().assetKey;
                });
            }

            const btnUI = this.createButtonDialog({
                dialogTittle: "Select Animation File Key",
                createDialogViewer: async (revealValue: string) => {

                    const viewer = new controls.viewers.TreeViewer("phasereditor2d.scene.ui.sceneobjects.CreateFromAsepriteCodeSnippetSection." + this.getId());

                    viewer.setCellRendererProvider(new controls.viewers.EmptyCellRendererProvider(e => new pack.ui.viewers.AnimationsItemCellRenderer()));
                    viewer.setLabelProvider(new pack.ui.viewers.AssetPackLabelProvider());
                    viewer.setTreeRenderer(new controls.viewers.TreeViewerRenderer(viewer));
                    viewer.setContentProvider(new controls.viewers.ArrayTreeContentProvider());

                    const finder = new pack.core.PackFinder();
                    await finder.preload();

                    const assetItems = finder
                        .getAssets(i => i instanceof pack.core.AsepriteAssetPackItem);

                    viewer.setInput(assetItems);

                    viewer.revealAndSelect(assetItems.find(a => a.getKey() === revealValue));

                    return viewer;
                },
                getValue: () => {

                    return this.getSelectionFirstElement().assetKey || "";
                },
                onValueSelected: (value: string) => {

                    this.getEditor().getUndoManager().add(new CodeSnippetsSnapshotOperation(this.getEditor(), async () => {

                        this.getSelectionFirstElement().assetKey = value;
                    }));
                },
                dialogElementToString: (viewer: controls.viewers.TreeViewer, value: pack.core.AsepriteAssetPackItem): string => {

                    return value.getKey();
                }
            });

            comp.appendChild(btnUI.buttonElement);
        }

        canEdit(obj: any, n: number): boolean {

            return obj instanceof codesnippets.CreateFromAsepriteCodeSnippet;
        }

        canEditNumber(n: number): boolean {

            return n === 1;
        }
    }
}