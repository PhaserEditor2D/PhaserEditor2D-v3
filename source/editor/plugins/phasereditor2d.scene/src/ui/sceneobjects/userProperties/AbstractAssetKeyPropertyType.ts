/// <reference path="./StringPropertyType.ts" />
namespace phasereditor2d.scene.ui.sceneobjects {

    import controls = colibri.ui.controls;

    export abstract class AbstractAssetKeyPropertyType extends StringPropertyType {


        private _name: string;
        private _hasCustomIcon: boolean;
        private _dialogTitle: string;

        protected constructor(config: {
            id: string,
            name: string,
            dialogTitle: string,
            hasCustomIcon?: boolean
        }) {
            super(config.id);

            this._name = config.name;
            this._dialogTitle = config.dialogTitle;
            this._hasCustomIcon = config.hasCustomIcon === undefined ? false : config.hasCustomIcon;
        }

        getName() {

            return this._name;
        }

        createInspectorPropertyEditor(
            section: SceneGameObjectSection<any>, parent: HTMLElement, userProp: UserProperty, lockIcon: boolean): void {

            const prop = userProp.getComponentProperty();

            if (lockIcon) {

                section.createLock(parent, prop);
            }

            const label = section.createLabel(parent, prop.label, PhaserHelp(prop.tooltip));
            label.style.gridColumn = "2";

            const comp = this.createEditorComp();
            parent.appendChild(comp);

            const text = section.createStringField(comp, prop);

            const btn = this.createSearchButton(() => prop.getValue(section.getSelectionFirstElement()), value => {

                text.value = value;

                const editor = section.getEditor();

                editor.getUndoManager().add(
                    new SimpleOperation(editor, section.getSelection(), prop, value));
            });

            section.addUpdater(() => {

                btn.disabled = !section.isUnlocked(prop);
            });

            comp.appendChild(btn);
        }

        private createEditorComp() {

            const comp = document.createElement("div");
            comp.style.display = "grid";
            comp.style.gridTemplateColumns = "1fr auto";
            comp.style.gridGap = "5px";
            comp.style.alignItems = "center";

            return comp;
        }

        private createSearchButton(getValue: () => any, callback: (value: string) => void) {

            const iconControl = new controls.IconControl(colibri.ColibriPlugin.getInstance().getIcon(colibri.ICON_FOLDER));

            const btn = document.createElement("button");
            btn.appendChild(iconControl.getCanvas());

            btn.addEventListener("click", async (e) => {

                const value = getValue();

                this.createSearchDialog(value, callback);
            });


            if (this._hasCustomIcon) {

                this.updateIcon(iconControl, getValue());
            }


            return btn;
        }

        private async updateIcon(iconControl: controls.IconControl, value: any) {

            const finder = new pack.core.PackFinder();

            await finder.preload();

            const icon = this.getIcon(finder, value);

            if (icon) {

                iconControl.setIcon(icon);
            }
        }

        protected hasCustomIcon() {

            return false;
        }

        protected getIcon(finder: pack.core.PackFinder, value: string): controls.IImage {

            return null;
        }

        protected createViewer(finder: pack.core.PackFinder) {

            const viewer = new controls.viewers.TreeViewer(
                "phasereditor2d.scene.ui.sceneobjects.SelectAssetDialog." + this.getId());

            viewer.setCellRendererProvider(new CellRendererProvider(finder, "tree"));
            viewer.setLabelProvider(new pack.ui.viewers.AssetPackLabelProvider());
            viewer.setTreeRenderer(new controls.viewers.TreeViewerRenderer(viewer));
            viewer.setContentProvider(new AssetKeyContentProvider());

            return viewer;
        }

        protected getDialogTitle() {

            return this._dialogTitle;
        }

        protected getDialogSize(): { width?: number, height?: number } {

            return {
                width: undefined,
                height: window.innerHeight * 2 / 3
            };
        }

        private async createSearchDialog(revealValue: string, callback: (value: string) => void) {

            const finder = new pack.core.PackFinder();

            const viewer = this.createViewer(finder);

            viewer.setInput([]);

            const dlg = new controls.dialogs.ViewerDialog(viewer, true);

            const size = this.getDialogSize();

            dlg.setSize(size.width, size.height);

            dlg.create();

            dlg.setTitle(this.getDialogTitle());

            dlg.enableButtonOnlyWhenOneElementIsSelected(
                dlg.addOpenButton("Select", sel => {

                    const selected = sel[0];

                    let value: string;

                    if (selected instanceof pack.core.AssetPackImageFrame) {

                        value = this.formatKeyFrame(selected.getPackItem().getKey(), selected.getName());

                    } else {

                        const key = viewer.getLabelProvider().getLabel(selected);

                        value = this.formatKeyFrame(key);
                    }

                    callback(value);
                }));

            dlg.addCancelButton();

            await finder.preload();

            viewer.setInput(finder.getPacks());

            for (const pack of finder.getPacks()) {

                viewer.setExpanded(pack, true);
            }

            this.revealValue(viewer, revealValue);

            controls.viewers.GridTreeViewerRenderer.expandSections(viewer);
        }

        protected revealValue(viewer: controls.viewers.TreeViewer, value: string) {

            const found = viewer.findElementByLabel(value);

            if (found) {

                viewer.setSelection([found]);
                viewer.reveal(found);
            }
        }

        createEditorElement(getValue: () => any, setValue: (value: any) => void): IPropertyEditor {

            const comp = this.createEditorComp();

            const inputElement = document.createElement("input");
            comp.appendChild(inputElement);
            inputElement.type = "text";
            inputElement.classList.add("formText");

            inputElement.addEventListener("change", e => {

                setValue(inputElement.value);
            });

            const update = () => {

                inputElement.value = getValue();
            };

            const btn = this.createSearchButton(getValue, setValue);
            comp.appendChild(btn);

            return {
                element: comp,
                update
            };
        }

        protected formatKeyFrame(key: string, frame?: string | number) {

            if (frame === undefined || frame === null) {

                return key;
            }

            return frame.toString();
        }
    }

    class CellRendererProvider extends pack.ui.viewers.AssetPackCellRendererProvider {

        private _finder: pack.core.PackFinder;

        constructor(finder: pack.core.PackFinder, layout: "tree" | "grid") {
            super(layout);

            this._finder = finder;
        }

        getCellRenderer(element: any) {

            if (element instanceof pack.core.AnimationConfigInPackItem) {

                return new AnimationCellRenderer(this._finder);
            }

            return super.getCellRenderer(element);
        }
    }

    class AnimationCellRenderer implements controls.viewers.ICellRenderer {

        private _finder: pack.core.PackFinder;
        public layout: "square" | "full-width" = "full-width";

        constructor(finder: pack.core.PackFinder) {

            this._finder = finder;
        }

        renderCell(args: controls.viewers.RenderCellArgs): void {

            const anim = args.obj as pack.core.AnimationConfigInPackItem;

            const frames = anim.getFrames();

            if (frames.length === 0) {

                return;
            }

            const cellSize = args.viewer.getCellSize();

            const len = frames.length;

            const indexes = [0, Math.floor(len / 2), len - 1];

            const ctx = args.canvasContext;

            ctx.save();

            if (cellSize <= controls.ROW_HEIGHT) {

                const img = this.getImage(frames[0]);

                if (img) {

                    img.paint(ctx, args.x, args.y, args.w, args.h, true);
                }

            } else {

                // tslint:disable-next-line:prefer-for-of
                for (let i = 0; i < indexes.length; i++) {

                    const frame = frames[indexes[i]];

                    const img = this.getImage(frame);

                    if (img) {

                        const x = Math.floor(args.x + i * cellSize * 0.8);

                        img.paint(ctx, x, args.y + 2, cellSize, args.h - 4, true);
                    }
                }
            }

            ctx.restore();
        }

        private getImage(frame: pack.core.AnimationFrameConfigInPackItem) {

            const image = this._finder.getAssetPackItemImage(frame.getTextureKey(), frame.getFrameKey());

            return image;
        }

        cellHeight(args: controls.viewers.RenderCellArgs): number {

            return args.viewer.getCellSize();
        }

        async preload(args: controls.viewers.PreloadCellArgs) {

            let result = controls.PreloadResult.NOTHING_LOADED;

            const anim = args.obj as pack.core.AnimationConfigInPackItem;

            for (const frame of anim.getFrames()) {

                const obj = this._finder.getAssetPackItemOrFrame(frame.getTextureKey(), frame.getFrameKey());

                if (obj) {

                    const objResult = await obj.preload();

                    result = Math.max(result, objResult);
                }
            }

            return result;
        }
    }

    class AssetKeyContentProvider implements controls.viewers.ITreeContentProvider {

        getRoots(input: any): any[] {

            return input;
        }

        getChildren(parent: any): any[] {

            if (parent instanceof pack.core.AssetPack) {

                return parent.getItems();
            }

            if (parent instanceof pack.core.ImageAssetPackItem) {

                return [];
            }

            if (parent instanceof pack.core.ImageFrameContainerAssetPackItem) {

                return parent.getFrames();
            }

            if (parent instanceof pack.core.AnimationsAssetPackItem) {

                return parent.getAnimations();
            }

            return [];
        }
    }
}