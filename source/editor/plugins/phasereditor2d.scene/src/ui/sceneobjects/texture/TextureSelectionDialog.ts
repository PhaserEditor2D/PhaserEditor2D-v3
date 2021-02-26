namespace phasereditor2d.scene.ui.sceneobjects {

    import controls = colibri.ui.controls;
    import io = colibri.core.io;

    const GROUP_BY_TYPE = "type";
    const GROUP_BY_PACK_FILE = "pack";
    const GROUP_BY_LOCATION = "location";
    const ALL_GROUP_BY = [
        GROUP_BY_TYPE,
        GROUP_BY_PACK_FILE,
        GROUP_BY_LOCATION,
    ]

    const GROUP_BY_LABEL_MAP = {
        "type": "Type",
        "pack": "Asset Pack File",
        "location": "Location"
    };

    const TYPES = [
        pack.core.IMAGE_TYPE,
        pack.core.SVG_TYPE,
        pack.core.ATLAS_TYPE,
        pack.core.SPRITESHEET_TYPE
    ];

    export class TextureSelectionDialog extends controls.dialogs.ViewerDialog {

        private _finder: pack.core.PackFinder;

        static async createDialog(
            finder: pack.core.PackFinder, selected: pack.core.AssetPackImageFrame[],
            callback: (selection: pack.core.AssetPackImageFrame[]) => void
        ) {

            const dlg = new TextureSelectionDialog(finder, callback);

            dlg.create();

            dlg.getViewer().setSelection(selected);
            dlg.getViewer().reveal(...selected);

            return dlg;
        }

        private _callback: (selection: pack.core.AssetPackImageFrame[]) => void;

        private constructor(
            finder: pack.core.PackFinder,
            callback: (selection: pack.core.AssetPackImageFrame[]) => void
        ) {
            super(new controls.viewers.TreeViewer("phasereditor2d.scene.ui.sceneobjects.TextureSelectionDialog"), true);

            this._finder = finder;
            this._callback = callback;

            this.setSize(window.innerWidth * 2 / 3, window.innerHeight * 2 / 3);
        }

        create() {

            const viewer = this.getViewer();

            viewer.setLabelProvider(new (class extends pack.ui.viewers.AssetPackLabelProvider {

                getLabel(obj: any) {

                    if (obj instanceof io.FilePath) {

                        return obj.getProjectRelativeName().substring(1);
                    }

                    return super.getLabel(obj);
                }
            })());

            viewer.setTreeRenderer(new (class extends pack.ui.viewers.AssetPackTreeViewerRenderer {

                isObjectSection(obj: any) {

                    return super.isObjectSection(obj) || obj instanceof pack.core.AssetPack || obj instanceof io.FilePath;
                }

            })(viewer, false));

            viewer.setCellRendererProvider(new pack.ui.viewers.AssetPackCellRendererProvider("grid"));
            viewer.setContentProvider(new TypeGroupingContentProvider(this._finder));
            viewer.setCellSize(64 * controls.DEVICE_PIXEL_RATIO, true);
            viewer.setInput(TYPES);

            viewer.expandRoots();

            super.create();

            this.setTitle("Select Texture");

            const btn = this.addButton("Select", () => {

                this._callback(this.getViewer().getSelection());

                this.close();
            });

            btn.disabled = true;

            viewer.eventSelectionChanged.addListener(() => {

                btn.disabled = this.getViewer().getSelection().length !== 1
                    || !pack.core.AssetPackUtils.isImageFrameOrImage(this.getViewer().getSelectionFirstElement());
            });

            viewer.eventOpenItem.addListener(() => btn.click());

            this.addButton("Cancel", () => this.close());

            this.updateFromGroupingType();
        }

        private getGroupingType() {

            return window.localStorage["phasereditor2d.scene.ui.sceneobjects.TextureSelectionDialog.groupBy"] || GROUP_BY_TYPE;
        }

        private setGroupingType(type: string) {

            window.localStorage["phasereditor2d.scene.ui.sceneobjects.TextureSelectionDialog.groupBy"] = type;
        }

        private typeBtn: HTMLButtonElement;

        private updateFromGroupingType() {

            const type = this.getGroupingType();

            this.typeBtn.textContent = "Group By " + GROUP_BY_LABEL_MAP[type];

            const viewer = this.getViewer();

            switch (type) {

                case GROUP_BY_TYPE:

                    viewer.setContentProvider(new TypeGroupingContentProvider(this._finder));
                    viewer.setInput(TYPES);

                    break;

                case GROUP_BY_PACK_FILE:

                    viewer.setContentProvider(new PackGroupingContentProvider(this._finder));
                    viewer.setInput(this._finder.getPacks());

                    break;

                case GROUP_BY_LOCATION:

                    viewer.setContentProvider(new LocationGroupingContentProvider(this._finder));
                    viewer.setInput(this._finder.getPacks());

                    break;
            }

            viewer.repaint();
            viewer.expandRoots();
        }

        fillContextMenu(menu: controls.Menu) {

            const selectedType = this.getGroupingType();

            for (const type of ALL_GROUP_BY) {

                menu.addAction({
                    text: "Group By " + GROUP_BY_LABEL_MAP[type],
                    selected: type === selectedType,
                    callback: () => {

                        this.setGroupingType(type);
                        this.updateFromGroupingType();
                    }
                });
            }
        }
    }

    class LocationGroupingContentProvider extends pack.ui.viewers.AssetPackContentProvider {

        static getFolders(finder: pack.core.PackFinder) {

            const folderSet: Set<io.FilePath> = new Set();

            for (const packFile of finder.getPacks()) {

                for (const item of packFile.getItems()) {

                    const folder = LocationGroupingContentProvider.getParentFolder(item);

                    if (folder) {

                        folderSet.add(folder);
                    }
                }
            }

            const folders = [...folderSet].sort((a, b) => a.getFullName().localeCompare(b.getFullName()));

            return folders;
        }

        private static getParentFolder(item: pack.core.AssetPackItem) {

            const data = item.getData();

            let file = pack.core.AssetPackUtils.getFileFromPackUrl(data["url"]);

            if (!file) {

                file = pack.core.AssetPackUtils.getFileFromPackUrl(data["atlasURL"]);
            }

            if (file) {

                return file.getParent();
            }

            return null;
        }

        private _finder: pack.core.PackFinder;

        constructor(finder: pack.core.PackFinder) {
            super();

            this._finder = finder;
        }

        getRoots(input: any): any[] {

            return LocationGroupingContentProvider.getFolders(this._finder);
        }

        getChildren(parent: any) {

            if (parent instanceof io.FilePath) {

                return this._finder.getPacks().flatMap(p => p.getItems()).filter(item => {

                    const folder = LocationGroupingContentProvider.getParentFolder(item);

                    return folder && folder === parent;

                }).filter(i => pack.core.AssetPackUtils.isAtlasType(i.getType()) || TYPES.indexOf(i.getType()) >= 0);
            }

            return super.getChildren(parent);
        }
    }

    class PackGroupingContentProvider extends pack.ui.viewers.AssetPackContentProvider {

        private _finder: pack.core.PackFinder;

        constructor(finder: pack.core.PackFinder) {
            super();

            this._finder = finder;
        }

        getRoots(input: any): any[] {

            return this._finder.getPacks();
        }

        getChildren(parent: any) {

            if (parent instanceof pack.core.AssetPack) {

                return parent.getItems().filter(i => {

                    return pack.core.AssetPackUtils.isAtlasType(i.getType()) || TYPES.indexOf(i.getType()) >= 0
                });
            }

            return super.getChildren(parent);
        }
    }

    class TypeGroupingContentProvider extends pack.ui.viewers.AssetPackContentProvider {

        private _finder: pack.core.PackFinder;

        constructor(finder: pack.core.PackFinder) {
            super();

            this._finder = finder;
        }

        getRoots(input: any): any[] {

            // the sections
            return input;
        }

        getPackItems() {

            return this._finder.getPacks().flatMap(p => p.getItems());
        }

        getChildren(parent: any) {

            switch (parent) {

                case pack.core.ATLAS_TYPE:

                    return this.getPackItems().filter(i => pack.core.AssetPackUtils.isAtlasType(i.getType()));

                case pack.core.IMAGE_TYPE:
                case pack.core.SVG_TYPE:
                case pack.core.SPRITESHEET_TYPE:

                    return this.getPackItems().filter(i => i.getType() === parent);
            }

            return super.getChildren(parent);
        }
    }
}