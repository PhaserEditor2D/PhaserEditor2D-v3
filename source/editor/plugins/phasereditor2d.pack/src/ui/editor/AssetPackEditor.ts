namespace phasereditor2d.pack.ui.editor {

    import ide = colibri.ui.ide;
    import controls = colibri.ui.controls;
    import dialogs = controls.dialogs;
    import io = colibri.core.io;

    export class AssetPackEditor extends ide.ViewerFileEditor {

        static _factory: ide.ContentTypeEditorFactory;
        private _revealKey: string;

        static getFactory() {

            return this._factory
                || (this._factory = new ide.ContentTypeEditorFactory("Asset Pack Editor",
                    core.contentTypes.CONTENT_TYPE_ASSET_PACK, () => new AssetPackEditor()));
        }

        private _pack: core.AssetPack;
        private _outlineProvider = new AssetPackEditorOutlineProvider(this);
        private _blocksProvider = new AssetPackEditorBlocksProvider(this);
        private _propertyProvider = new properties.AssetPackEditorPropertyProvider(this);

        constructor() {
            super("phasereditor2d.pack.ui.AssetPackEditor", AssetPackEditor.getFactory());

            this.addClass("AssetPackEditor");
        }

        protected fillContextMenu(menu: controls.Menu) {

            menu.addCommand(CMD_ASSET_PACK_EDITOR_ADD_FILE);
            menu.addCommand(ide.actions.CMD_DELETE);
            menu.addAction({
                text: "Settings",
                callback: () => {

                    this.getViewer().setSelection([]);
                }
            });
        }

        static isEditorScope(args: ide.commands.HandlerArgs) {

            return args.activePart instanceof AssetPackEditor ||

                args.activePart instanceof outline.ui.views.OutlineView

                && args.activeEditor instanceof AssetPackEditor;
        }

        deleteSelection() {

            const toDelete = this._viewer.getSelection().filter(obj => obj instanceof core.AssetPackItem);

            if (toDelete.length === 0) {
                return;
            }

            const before = undo.AssetPackEditorOperation.takeSnapshot(this);

            for (const obj of toDelete) {
                this._pack.deleteItem(obj);
            }

            const after = undo.AssetPackEditorOperation.takeSnapshot(this);

            this.getUndoManager().add(new undo.AssetPackEditorOperation(this, before, after));

            this.updateAll();

            this.setDirty(true);
        }

        updateAll() {

            this.repaintEditorAndOutline();

            this._blocksProvider.updateBlocks_async();

            this.setSelection([]);
        }

        repaintEditorAndOutline() {

            this._viewer.repaint();

            this._outlineProvider.repaint();
        }

        protected createViewer(): controls.viewers.TreeViewer {

            const viewer = new controls.viewers.TreeViewer("phasereditor2d.pack.ui.editor.AssetPackEditor");

            viewer.setContentProvider(new AssetPackEditorContentProvider(this));
            viewer.setLabelProvider(new viewers.AssetPackLabelProvider());
            viewer.setCellRendererProvider(new viewers.AssetPackCellRendererProvider("grid"));
            const treeRenderer = new AssetPackEditorTreeViewerRenderer(this, viewer);
            viewer.setTreeRenderer(treeRenderer);
            viewer.setCellSize(96);
            viewer.setInput(this);

            viewer.eventSelectionChanged.addListener(() => {

                this._outlineProvider.setSelection(viewer.getSelection(), true, false);

                this._outlineProvider.repaint();
            });

            return viewer;
        }

        createPart() {

            super.createPart();

            this.updateContent();

            this.getViewer().expandRoots();
        }

        private async updateContent() {

            const file = this.getInput();

            if (!file) {

                return;
            }

            if (!this.getViewer()) {

                return;
            }

            const content = await ide.FileUtils.preloadAndGetFileString(file);

            const finder = new pack.core.PackFinder();

            await finder.preload();

            this._pack = new core.AssetPack(file, content);

            for(const item of this._pack.getItems()) {

                await item.preload();
                
                await item.build(finder);
            }

            this.getViewer().repaint();

            await this.refreshBlocks();

            this._outlineProvider.repaint();

            if (this._revealKey) {

                this.revealKeyNow(this._revealKey);

                this._revealKey = null;
            }

            this.setSelection(this.getSelection());
        }

        async doSave() {

            const content = JSON.stringify(this._pack.toJSON(), null, 4);

            try {

                await ide.FileUtils.setFileString_async(this.getInput(), content);

                this.setDirty(false);

            } catch (e) {
                console.error(e);
            }
        }

        revealKey(key: string) {

            if (!this._pack) {

                this._revealKey = key;

            } else {

                this.revealKeyNow(key);
            }
        }

        private revealKeyNow(key: string) {

            const item = this._pack.getItems().find(i => i.getKey() === key);

            if (item) {

                this.getViewer().setSelection([item]);
                this.getViewer().reveal(item);
            }
        }

        protected onEditorInputContentChangedByExternalEditor() {

            this.updateContent();
        }

        async onPartActivated() {

            super.onPartActivated();

            await this.resetPackCache();

            await this.refreshBlocks();
        }

        private async resetPackCache() {

            if (!this._pack) {
                return;
            }

            for (const item of this._pack.getItems()) {

                item.resetCache();

                await item.preload();
            }

            this._viewer.repaint();
        }

        getPack() {
            return this._pack;
        }

        getEditorViewerProvider(key: string): ide.EditorViewerProvider {

            switch (key) {

                case outline.ui.views.OutlineView.EDITOR_VIEWER_PROVIDER_KEY:

                    return this._outlineProvider;

                case blocks.ui.views.BlocksView.EDITOR_VIEWER_PROVIDER_KEY:

                    return this._blocksProvider;
            }

            return null;
        }

        getPropertyProvider() {

            return this._propertyProvider;
        }

        createEditorToolbar(parent: HTMLElement) {

            const manager = new controls.ToolbarManager(parent);

            manager.addAction({
                text: "Import File",
				tooltip: "Import a new file into the project by adding an entry for it to this Asset Pack.",
                icon: colibri.ColibriPlugin.getInstance().getIcon(colibri.ICON_PLUS),
                callback: () => this.openAddFileDialog()
            });

            return manager;
        }

        openAddFileDialog() {

            const viewer = new controls.viewers.TreeViewer("phasereditor2d.pack.ui.editor.AssetPackEditor.AddFileDialog");

            viewer.setLabelProvider(new viewers.AssetPackLabelProvider());
            viewer.setContentProvider(new controls.viewers.ArrayTreeContentProvider());
            viewer.setCellRendererProvider(new viewers.AssetPackCellRendererProvider("tree"));
            viewer.setInput(AssetPackPlugin.getInstance().getAssetPackItemTypes());

            const dlg = new dialogs.ViewerDialog(viewer, false);

            const selectCallback = async () => {

                const type = viewer.getSelection()[0] as string;

                await this.openSelectFileDialog_async(type);
            };

            dlg.create();

            dlg.setTitle("Select File Type");

            {
                const btn = dlg.addButton("Select", selectCallback);

                btn.disabled = true;

                viewer.eventSelectionChanged.addListener(() => {

                    btn.disabled = viewer.getSelection().length === 0;
                });
            }

            dlg.addButton("Cancel", () => {

                dlg.close();
            });

            viewer.eventOpenItem.addListener(() => selectCallback());
        }

        async createFilesViewer(filter: (file: io.FilePath) => boolean) {

            const viewer = new controls.viewers.TreeViewer(this.getId() + ".AssetPackEditor");

            viewer.setLabelProvider(new files.ui.viewers.FileLabelProvider());
            viewer.setContentProvider(new controls.viewers.ArrayTreeContentProvider());
            viewer.setCellRendererProvider(new files.ui.viewers.FileCellRendererProvider());

            const ignoreFileSet = new IgnoreFileSet(this);

            await ignoreFileSet.updateIgnoreFileSet_async();

            const folder = this.getInput().getParent();

            const allFiles = folder.flatTree([], false);

            const list = allFiles

                .filter(file => !ignoreFileSet.has(file) && filter(file));

            viewer.setInput(list);

            return viewer;
        }

        private async openSelectFileDialog_async(type: string) {

            const importer = importers.Importers.getImporter(type);

            const viewer = await this.createFilesViewer(file => importer.acceptFile(file));

            const dlg = new dialogs.ViewerDialog(viewer, true);

            dlg.create();

            dlg.setTitle("Select Files");

            const importFilesCallback = async (files: io.FilePath[]) => {

                dlg.closeAll();

                await this.importData_async({
                    importer: importer,
                    files: files
                });
            };

            {
                const btn = dlg.addButton("Select", () => {
                    importFilesCallback(viewer.getSelection());
                });

                btn.disabled = true;

                viewer.eventSelectionChanged.addListener(() => {

                    btn.disabled = viewer.getSelection().length === 0;
                });
            }

            dlg.addButton("Show All Files", () => {

                const input = this.getPack().isShowAllFilesInBlocks ?

                    colibri.Platform.getWorkbench().getProjectRoot() :

                    this.getInput().getParent();

                viewer.setInput(input.flatTree([], false));
                viewer.repaint();
            });

            dlg.addButton("Cancel", () => {
                dlg.close();
            });

            viewer.eventOpenItem.addListener(async () => {

                importFilesCallback([viewer.getSelection()[0]]);
            });
        }

        async importData_async(importData: IImportData) {

            const before = undo.AssetPackEditorOperation.takeSnapshot(this);

            const items = await importData.importer.autoImport(this._pack, importData.files);

            const finder = new pack.core.PackFinder(this._pack);

            for (const item of items) {

                await item.preload();

                await item.build(finder);
            }

            this._viewer.repaint();

            this.setDirty(true);

            await this.refreshBlocks();

            this._viewer.setSelection(items);

            this._viewer.reveal(...items);

            const after = undo.AssetPackEditorOperation.takeSnapshot(this);

            this.getUndoManager().add(new undo.AssetPackEditorOperation(this, before, after));
        }

        async refreshBlocks() {

            if (!this._pack) {
                return;
            }

            await this._blocksProvider.updateBlocks_async();
        }
    }
}