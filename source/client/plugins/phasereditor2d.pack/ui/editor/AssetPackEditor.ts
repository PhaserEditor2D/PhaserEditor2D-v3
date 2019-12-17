namespace phasereditor2d.pack.ui.editor {

    import ide = colibri.ui.ide;
    import controls = colibri.ui.controls;
    import dialogs = controls.dialogs;
    import io = colibri.core.io;

    export class AssetPackEditorFactory extends ide.EditorFactory {

        constructor() {
            super("phasereditor2d.AssetPackEditorFactory");
        }

        acceptInput(input: any): boolean {

            if (input instanceof io.FilePath) {

                const contentType = ide.Workbench.getWorkbench().getContentTypeRegistry().getCachedContentType(input);

                return contentType === pack.core.contentTypes.CONTENT_TYPE_ASSET_PACK;
            }

            return false;
        }

        createEditor(): ide.EditorPart {
            return new AssetPackEditor();
        }

    }

    export class AssetPackEditor extends ide.ViewerFileEditor {

        private _pack: core.AssetPack;
        private _outlineProvider = new AssetPackEditorOutlineProvider(this);
        private _blocksProvider = new AssetPackEditorBlocksProvider(this);
        private _propertyProvider = new properties.AssetPackEditorPropertyProvider();

        constructor() {
            super("phasereditor2d.AssetPackEditor");

            this.addClass("AssetPackEditor");
        }

        static getFactory(): AssetPackEditorFactory {
            return new AssetPackEditorFactory();
        }

        static registerCommands(manager: ide.commands.CommandManager) {

            // delete 

            manager.addHandlerHelper(ide.actions.CMD_DELETE,

                args => AssetPackEditor.isEditorScope(args),

                args => {
                    const editor = <AssetPackEditor>args.activeEditor;
                    editor.deleteSelection();
                });
        }

        private static isEditorScope(args: ide.commands.CommandArgs) {

            return args.activePart instanceof AssetPackEditor ||

                args.activePart instanceof outline.ui.views.OutlineView

                && args.activeEditor instanceof AssetPackEditor
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

            const viewer = new controls.viewers.TreeViewer();

            viewer.setContentProvider(new AssetPackEditorContentProvider(this, true));
            viewer.setLabelProvider(new viewers.AssetPackLabelProvider());
            viewer.setCellRendererProvider(new viewers.AssetPackCellRendererProvider("grid"));
            viewer.setTreeRenderer(new viewers.AssetPackTreeViewerRenderer(viewer, true));
            viewer.setCellSize(96);
            viewer.setInput(this);

            viewer.addEventListener(controls.EVENT_SELECTION_CHANGED, e => {

                this._outlineProvider.setSelection(viewer.getSelection(), true, false);

                this._outlineProvider.repaint();
            });

            this.updateContent();

            return viewer;
        }

        private async updateContent() {

            const file = this.getInput();

            if (!file) {
                return;
            }

            const content = await ide.FileUtils.preloadAndGetFileString(file);
            this._pack = new core.AssetPack(file, content);

            this.getViewer().repaint();

            await this.updateBlocks();
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

        protected onEditorInputContentChanged() {
            //TODO: missing to implement
        }

        async onPartActivated() {

            super.onPartActivated();

            await this.resetPackCache();

            await this.updateBlocks();
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

            manager.add(new controls.Action({
                text: "Add File",
                icon: ide.Workbench.getWorkbench().getWorkbenchIcon(ide.ICON_PLUS),
                callback: () => {
                    this.openAddFileDialog();
                }
            }));

            return manager;
        }

        private openAddFileDialog() {

            const viewer = new controls.viewers.TreeViewer();

            viewer.setLabelProvider(new viewers.AssetPackLabelProvider());
            viewer.setContentProvider(new controls.viewers.ArrayTreeContentProvider());
            viewer.setCellRendererProvider(new viewers.AssetPackCellRendererProvider("tree"));
            viewer.setInput(core.TYPES);

            const dlg = new dialogs.ViewerDialog(viewer);

            const selectCallback = async () => {

                const type = <string>viewer.getSelection()[0];

                await this.openSelectFileDialog_async(type);
            };

            dlg.create();

            dlg.setTitle("Select File Type");

            {
                const btn = dlg.addButton("Select", selectCallback);

                btn.disabled = true;

                viewer.addEventListener(controls.EVENT_SELECTION_CHANGED, e => {
                    btn.disabled = viewer.getSelection().length === 0;
                })
            }

            dlg.addButton("Cancel", () => {
                dlg.close();
            });

            viewer.addEventListener(controls.viewers.EVENT_OPEN_ITEM, e => selectCallback());
        }


        async createFilesViewer(filter: (file: io.FilePath) => boolean) {

            const viewer = new controls.viewers.TreeViewer();

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

            const dlg = new dialogs.ViewerDialog(viewer);

            dlg.create();

            dlg.setTitle("Select Files")

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

                viewer.addEventListener(controls.EVENT_SELECTION_CHANGED, e => {
                    btn.disabled = viewer.getSelection().length === 0;
                });
            }

            dlg.addButton("Show All Files", () => {
                viewer.setInput(this.getInput().getParent().flatTree([], false));
                viewer.repaint();
            });

            dlg.addButton("Cancel", () => {
                dlg.close();
            });

            viewer.addEventListener(controls.viewers.EVENT_OPEN_ITEM, async (e) => {
                importFilesCallback([viewer.getSelection()[0]]);
            });
        }

        async importData_async(importData: ImportData) {

            const before = undo.AssetPackEditorOperation.takeSnapshot(this);

            const sel = [];

            for (const file of importData.files) {

                const item = await importData.importer.importFile(this._pack, file);

                await item.preload();

                sel.push(item);
            }

            this._viewer.repaint();

            this.setDirty(true);

            await this.updateBlocks();

            this._viewer.setSelection(sel);

            this._viewer.reveal(...sel);

            const after = undo.AssetPackEditorOperation.takeSnapshot(this);

            this.getUndoManager().add(new undo.AssetPackEditorOperation(this, before, after));
        }

        private async updateBlocks() {
            await this._blocksProvider.updateBlocks_async();
        }
    }
}