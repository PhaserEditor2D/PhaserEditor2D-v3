var phasereditor2d;
(function (phasereditor2d) {
    var files;
    (function (files) {
        var ide = colibri.ui.ide;
        files.ICON_NEW_FILE = "file-new";
        class FilesPlugin extends colibri.Plugin {
            constructor() {
                super("phasereditor2d.files");
            }
            static getInstance() {
                return this._instance;
            }
            registerExtensions(reg) {
                // icons loader 
                reg.addExtension(colibri.ui.ide.IconLoaderExtension.withPluginFiles(this, [
                    files.ICON_NEW_FILE
                ]));
                // new files
                reg.addExtension(new files.ui.dialogs.NewFolderExtension());
                // commands
                reg.addExtension(new ide.commands.CommandExtension(files.ui.actions.FilesViewCommands.registerCommands));
            }
        }
        FilesPlugin._instance = new FilesPlugin();
        files.FilesPlugin = FilesPlugin;
        colibri.Platform.addPlugin(FilesPlugin.getInstance());
    })(files = phasereditor2d.files || (phasereditor2d.files = {}));
})(phasereditor2d || (phasereditor2d = {}));
var phasereditor2d;
(function (phasereditor2d) {
    var files;
    (function (files_1) {
        var ui;
        (function (ui) {
            var actions;
            (function (actions) {
                class DeleteFilesAction extends colibri.ui.ide.actions.ViewerViewAction {
                    static isEnabled(view) {
                        const sel = view.getViewer().getSelection();
                        if (sel.length > 0) {
                            for (const obj of sel) {
                                const file = obj;
                                if (!file.getParent()) {
                                    return false;
                                }
                            }
                            return true;
                        }
                        return false;
                    }
                    constructor(view) {
                        super(view, {
                            text: "Delete",
                            enabled: DeleteFilesAction.isEnabled(view)
                        });
                    }
                    run() {
                        const files = this.getViewViewerSelection();
                        if (confirm(`Do you want to delete ${files.length} files?\This operation cannot be undone.`)) {
                            if (files.length > 0) {
                                colibri.ui.ide.FileUtils.deleteFiles_async(files);
                            }
                        }
                    }
                }
                actions.DeleteFilesAction = DeleteFilesAction;
            })(actions = ui.actions || (ui.actions = {}));
        })(ui = files_1.ui || (files_1.ui = {}));
    })(files = phasereditor2d.files || (phasereditor2d.files = {}));
})(phasereditor2d || (phasereditor2d = {}));
var phasereditor2d;
(function (phasereditor2d) {
    var files;
    (function (files) {
        var ui;
        (function (ui) {
            var actions;
            (function (actions) {
                actions.CMD_NEW_FILE = "phasereditor2d.files.ui.actions.newfile";
                function isFilesViewScope(args) {
                    return args.activePart instanceof ui.views.FilesView;
                }
                class FilesViewCommands {
                    static registerCommands(manager) {
                        // new file
                        manager.addCommandHelper(actions.CMD_NEW_FILE);
                        manager.addHandlerHelper(actions.CMD_NEW_FILE, actions.OpenNewFileDialogAction.commandTest, args => {
                            new actions.OpenNewFileDialogAction().run();
                        });
                        manager.addKeyBinding(actions.CMD_NEW_FILE, new colibri.ui.ide.commands.KeyMatcher({
                            control: true,
                            alt: true,
                            key: "N",
                            filterInputElements: false
                        }));
                        // delete file
                        manager.addHandlerHelper(colibri.ui.ide.actions.CMD_DELETE, args => isFilesViewScope(args) && actions.DeleteFilesAction.isEnabled(args.activePart), args => {
                            new actions.DeleteFilesAction(args.activePart).run();
                        });
                        // rename file
                        manager.addHandlerHelper(colibri.ui.ide.actions.CMD_RENAME, args => isFilesViewScope(args) && actions.RenameFileAction.isEnabled(args.activePart), args => {
                            new actions.RenameFileAction(args.activePart).run();
                        });
                    }
                }
                actions.FilesViewCommands = FilesViewCommands;
            })(actions = ui.actions || (ui.actions = {}));
        })(ui = files.ui || (files.ui = {}));
    })(files = phasereditor2d.files || (phasereditor2d.files = {}));
})(phasereditor2d || (phasereditor2d = {}));
var phasereditor2d;
(function (phasereditor2d) {
    var files;
    (function (files) {
        var ui;
        (function (ui) {
            var actions;
            (function (actions) {
                var controls = colibri.ui.controls;
                class MoveFilesAction extends colibri.ui.ide.actions.ViewerViewAction {
                    static isEnabled(view) {
                        return view.getViewer().getSelection().length > 0;
                    }
                    constructor(view) {
                        super(view, {
                            text: "Move",
                            enabled: MoveFilesAction.isEnabled(view)
                        });
                    }
                    run() {
                        const rootFolder = colibri.ui.ide.FileUtils.getRoot();
                        const viewer = new controls.viewers.TreeViewer();
                        viewer.setLabelProvider(new ui.viewers.FileLabelProvider());
                        viewer.setCellRendererProvider(new ui.viewers.FileCellRendererProvider());
                        viewer.setContentProvider(new ui.viewers.FileTreeContentProvider(true));
                        viewer.setInput(rootFolder);
                        viewer.setExpanded(rootFolder, true);
                        const dlg = new controls.dialogs.ViewerDialog(viewer);
                        dlg.create();
                        dlg.setTitle("Move Files");
                        {
                            const btn = dlg.addButton("Move", () => { });
                            btn.disabled = true;
                            viewer.addEventListener(controls.EVENT_SELECTION_CHANGED, e => {
                                const sel = viewer.getSelection();
                                let enabled = true;
                                if (sel.length !== 1) {
                                    enabled = false;
                                }
                                else {
                                    const moveTo = sel[0];
                                    for (const obj of this.getViewViewerSelection()) {
                                        const file = obj;
                                        if (moveTo.getFullName().startsWith(file.getFullName())
                                            || moveTo === file.getParent()
                                            || moveTo.getFile(file.getName())) {
                                            enabled = false;
                                            break;
                                        }
                                    }
                                }
                                btn.disabled = !enabled;
                            });
                            btn.addEventListener("click", async () => {
                                const moveTo = viewer.getSelectionFirstElement();
                                const movingFiles = this.getViewViewer().getSelection();
                                await colibri.ui.ide.FileUtils.moveFiles_async(movingFiles, moveTo);
                                this.getViewViewer().reveal(movingFiles[0]);
                                this.getViewViewer().repaint();
                                dlg.close();
                            });
                        }
                        dlg.addButton("Cancel", () => dlg.close());
                    }
                }
                actions.MoveFilesAction = MoveFilesAction;
            })(actions = ui.actions || (ui.actions = {}));
        })(ui = files.ui || (files.ui = {}));
    })(files = phasereditor2d.files || (phasereditor2d.files = {}));
})(phasereditor2d || (phasereditor2d = {}));
var phasereditor2d;
(function (phasereditor2d) {
    var files;
    (function (files) {
        var ui;
        (function (ui) {
            var actions;
            (function (actions) {
                class NewFileAction extends colibri.ui.ide.actions.ViewerViewAction {
                    constructor(view) {
                        super(view, {
                            text: "New...",
                            enabled: true
                        });
                    }
                    run() {
                        const openDialogAction = new actions.OpenNewFileDialogAction();
                        let folder = this.getViewViewer().getSelectionFirstElement();
                        if (folder) {
                            if (folder.isFile()) {
                                folder = folder.getParent();
                            }
                            openDialogAction.setInitialLocation(folder);
                        }
                        openDialogAction.run();
                    }
                }
                actions.NewFileAction = NewFileAction;
            })(actions = ui.actions || (ui.actions = {}));
        })(ui = files.ui || (files.ui = {}));
    })(files = phasereditor2d.files || (phasereditor2d.files = {}));
})(phasereditor2d || (phasereditor2d = {}));
var phasereditor2d;
(function (phasereditor2d) {
    var files;
    (function (files) {
        var ui;
        (function (ui) {
            var actions;
            (function (actions) {
                var controls = colibri.ui.controls;
                class OpenNewFileDialogAction extends controls.Action {
                    constructor() {
                        super({
                            //text: "New File",
                            icon: files.FilesPlugin.getInstance().getIcon(files.ICON_NEW_FILE)
                        });
                    }
                    static commandTest(args) {
                        const root = colibri.ui.ide.FileUtils.getRoot();
                        return root !== null && !args.activeDialog;
                    }
                    run() {
                        const viewer = new controls.viewers.TreeViewer();
                        viewer.setLabelProvider(new WizardLabelProvider());
                        viewer.setContentProvider(new controls.viewers.ArrayTreeContentProvider());
                        viewer.setCellRendererProvider(new WizardCellRendererProvider());
                        const extensions = colibri.Platform.getExtensionRegistry()
                            .getExtensions(files.ui.dialogs.NewFileExtension.POINT_ID);
                        viewer.setInput(extensions);
                        const dlg = new controls.dialogs.ViewerDialog(viewer);
                        dlg.create();
                        dlg.setTitle("New");
                        {
                            const selectCallback = () => {
                                dlg.close();
                                this.openFileDialog(viewer.getSelectionFirstElement());
                            };
                            const btn = dlg.addButton("Select", () => selectCallback());
                            btn.disabled = true;
                            viewer.addEventListener(controls.EVENT_SELECTION_CHANGED, e => {
                                btn.disabled = viewer.getSelection().length !== 1;
                            });
                            viewer.addEventListener(controls.viewers.EVENT_OPEN_ITEM, e => selectCallback());
                        }
                        dlg.addButton("Cancel", () => dlg.close());
                    }
                    openFileDialog(extension) {
                        var _a;
                        const dlg = extension.createDialog();
                        dlg.setTitle(`New ${extension.getWizardName()}`);
                        dlg.setInitialFileName(extension.getInitialFileName());
                        dlg.setInitialLocation((_a = this._initialLocation, (_a !== null && _a !== void 0 ? _a : extension.getInitialFileLocation())));
                        dlg.validate();
                    }
                    setInitialLocation(folder) {
                        this._initialLocation = folder;
                    }
                }
                actions.OpenNewFileDialogAction = OpenNewFileDialogAction;
                class WizardLabelProvider {
                    getLabel(obj) {
                        return obj.getWizardName();
                    }
                }
                class WizardCellRendererProvider {
                    getCellRenderer(element) {
                        const ext = element;
                        return new controls.viewers.IconImageCellRenderer(ext.getIcon());
                    }
                    preload(args) {
                        return controls.Controls.resolveNothingLoaded();
                    }
                }
            })(actions = ui.actions || (ui.actions = {}));
        })(ui = files.ui || (files.ui = {}));
    })(files = phasereditor2d.files || (phasereditor2d.files = {}));
})(phasereditor2d || (phasereditor2d = {}));
var phasereditor2d;
(function (phasereditor2d) {
    var files;
    (function (files) {
        var ui;
        (function (ui) {
            var actions;
            (function (actions) {
                var controls = colibri.ui.controls;
                class RenameFileAction extends colibri.ui.ide.actions.ViewerViewAction {
                    static isEnabled(view) {
                        return view.getViewer().getSelection().length === 1;
                    }
                    constructor(view) {
                        super(view, {
                            text: "Rename",
                            enabled: RenameFileAction.isEnabled(view)
                        });
                    }
                    run() {
                        const file = this.getViewViewer().getSelectionFirstElement();
                        const parent = file.getParent();
                        const dlg = new controls.dialogs.InputDialog();
                        dlg.create();
                        dlg.setTitle("Rename");
                        dlg.setMessage("Enter the new name");
                        dlg.setInitialValue(file.getName());
                        dlg.setInputValidator(value => {
                            var _a;
                            if (value.indexOf("/") >= 0) {
                                return false;
                            }
                            if (parent) {
                                const file2 = (_a = parent.getFile(value), (_a !== null && _a !== void 0 ? _a : null));
                                return file2 === null;
                            }
                            return false;
                        });
                        dlg.setResultCallback(result => {
                            colibri.ui.ide.FileUtils.renameFile_async(file, result);
                        });
                        dlg.validate();
                    }
                }
                actions.RenameFileAction = RenameFileAction;
            })(actions = ui.actions || (ui.actions = {}));
        })(ui = files.ui || (files.ui = {}));
    })(files = phasereditor2d.files || (phasereditor2d.files = {}));
})(phasereditor2d || (phasereditor2d = {}));
var phasereditor2d;
(function (phasereditor2d) {
    var files;
    (function (files) {
        var ui;
        (function (ui) {
            var dialogs;
            (function (dialogs) {
                var controls = colibri.ui.controls;
                var viewers = colibri.ui.controls.viewers;
                class BaseNewFileDialog extends controls.dialogs.Dialog {
                    constructor() {
                        super("NewFileDialog");
                    }
                    createDialogArea() {
                        const clientArea = document.createElement("div");
                        clientArea.classList.add("DialogClientArea");
                        clientArea.style.display = "grid";
                        clientArea.style.gridTemplateRows = "1fr auto";
                        clientArea.style.gridTemplateRows = "1fr";
                        clientArea.style.gridRowGap = "5px";
                        clientArea.appendChild(this.createCenterArea());
                        clientArea.appendChild(this.createBottomArea());
                        this.getElement().appendChild(clientArea);
                    }
                    createBottomArea() {
                        const bottomArea = document.createElement("div");
                        bottomArea.classList.add("DialogSection");
                        bottomArea.style.display = "grid";
                        bottomArea.style.gridTemplateColumns = "auto 1fr";
                        bottomArea.style.gridTemplateRows = "auto";
                        bottomArea.style.columnGap = "10px";
                        bottomArea.style.rowGap = "10px";
                        bottomArea.style.alignItems = "center";
                        {
                            const label = document.createElement("label");
                            label.innerText = "Location";
                            bottomArea.appendChild(label);
                            const text = document.createElement("input");
                            text.type = "text";
                            text.readOnly = true;
                            bottomArea.appendChild(text);
                            this._filteredViewer.getViewer().addEventListener(controls.EVENT_SELECTION_CHANGED, e => {
                                const file = this._filteredViewer.getViewer().getSelectionFirstElement();
                                text.value = file === null ? "" : `${file.getFullName()}/`;
                            });
                        }
                        {
                            const label = document.createElement("label");
                            label.innerText = "Name";
                            bottomArea.appendChild(label);
                            const text = document.createElement("input");
                            text.type = "text";
                            bottomArea.appendChild(text);
                            setTimeout(() => text.focus(), 10);
                            text.addEventListener("keyup", e => this.validate());
                            this._fileNameText = text;
                        }
                        return bottomArea;
                    }
                    normalizedFileName() {
                        return this._fileNameText.value;
                    }
                    validate() {
                        const folder = this._filteredViewer.getViewer().getSelectionFirstElement();
                        let valid = folder !== null;
                        if (valid) {
                            const name = this.normalizedFileName();
                            if (name.indexOf("/") >= 0 || name.trim() === "") {
                                valid = false;
                            }
                            else {
                                const file = folder.getFile(name);
                                if (file) {
                                    valid = false;
                                }
                            }
                        }
                        this._createBtn.disabled = !valid;
                    }
                    setFileCreatedCallback(callback) {
                        this._fileCreatedCallback = callback;
                    }
                    setInitialFileName(filename) {
                        this._fileNameText.value = filename;
                    }
                    setInitialLocation(folder) {
                        this._filteredViewer.getViewer().setSelection([folder]);
                        this._filteredViewer.getViewer().reveal(folder);
                    }
                    create() {
                        super.create();
                        this._createBtn = this.addButton("Create", () => this.createFile_priv());
                        this.addButton("Cancel", () => this.close());
                        this.validate();
                    }
                    async createFile_priv() {
                        const folder = this._filteredViewer.getViewer().getSelectionFirstElement();
                        const name = this.normalizedFileName();
                        const file = await this.createFile(folder, name);
                        this.close();
                        if (this._fileCreatedCallback) {
                            this._fileCreatedCallback(file);
                        }
                    }
                    createCenterArea() {
                        const centerArea = document.createElement("div");
                        this.createFilteredViewer();
                        centerArea.appendChild(this._filteredViewer.getElement());
                        return centerArea;
                    }
                    createFilteredViewer() {
                        const viewer = new viewers.TreeViewer();
                        viewer.setLabelProvider(new files.ui.viewers.FileLabelProvider());
                        viewer.setContentProvider(new files.ui.viewers.FileTreeContentProvider(true));
                        viewer.setCellRendererProvider(new files.ui.viewers.FileCellRendererProvider());
                        viewer.setInput(colibri.Platform.getWorkbench().getProjectRoot());
                        viewer.addEventListener(controls.EVENT_SELECTION_CHANGED, e => {
                            this.validate();
                        });
                        this._filteredViewer = new viewers.FilteredViewerInElement(viewer);
                    }
                    layout() {
                        super.layout();
                        this._filteredViewer.resizeTo();
                    }
                }
                dialogs.BaseNewFileDialog = BaseNewFileDialog;
            })(dialogs = ui.dialogs || (ui.dialogs = {}));
        })(ui = files.ui || (files.ui = {}));
    })(files = phasereditor2d.files || (phasereditor2d.files = {}));
})(phasereditor2d || (phasereditor2d = {}));
var phasereditor2d;
(function (phasereditor2d) {
    var files;
    (function (files_2) {
        var ui;
        (function (ui) {
            var dialogs;
            (function (dialogs) {
                class NewFileExtension extends colibri.Extension {
                    constructor(config) {
                        super(NewFileExtension.POINT_ID);
                        this._wizardName = config.wizardName;
                        this._icon = config.icon;
                        this._initialFileName = config.initialFileName;
                    }
                    getInitialFileName() {
                        return this._initialFileName;
                    }
                    getWizardName() {
                        return this._wizardName;
                    }
                    getIcon() {
                        return this._icon;
                    }
                    getInitialFileLocation() {
                        return colibri.Platform.getWorkbench().getProjectRoot();
                    }
                    findInitialFileLocationBasedOnContentType(contentType) {
                        const root = colibri.Platform.getWorkbench().getProjectRoot();
                        const files = [];
                        root.flatTree(files, false);
                        const reg = colibri.Platform.getWorkbench().getContentTypeRegistry();
                        const targetFiles = files.filter(file => contentType === reg.getCachedContentType(file));
                        if (targetFiles.length > 0) {
                            targetFiles.sort((a, b) => {
                                return b.getModTime() - a.getModTime();
                            });
                            return targetFiles[0].getParent();
                        }
                        return root;
                    }
                }
                NewFileExtension.POINT_ID = "phasereditor2d.files.ui.dialogs.NewFileDialogExtension";
                dialogs.NewFileExtension = NewFileExtension;
            })(dialogs = ui.dialogs || (ui.dialogs = {}));
        })(ui = files_2.ui || (files_2.ui = {}));
    })(files = phasereditor2d.files || (phasereditor2d.files = {}));
})(phasereditor2d || (phasereditor2d = {}));
/// <reference path="./NewFileExtension.ts" />
var phasereditor2d;
(function (phasereditor2d) {
    var files;
    (function (files) {
        var ui;
        (function (ui) {
            var dialogs;
            (function (dialogs) {
                class NewFileContentExtension extends dialogs.NewFileExtension {
                    constructor(config) {
                        super(config);
                        this._fileExtension = config.fileExtension;
                        this._fileContent = config.fileContent;
                    }
                    createDialog() {
                        const dlg = new files.ui.dialogs.NewFileDialog();
                        dlg.create();
                        dlg.setFileExtension(this._fileExtension);
                        dlg.setFileContent(this._fileContent);
                        dlg.setFileCreatedCallback(async (file) => {
                            const wb = colibri.Platform.getWorkbench();
                            const reg = wb.getContentTypeRegistry();
                            await reg.preload(file);
                            wb.openEditor(file);
                        });
                        return dlg;
                    }
                }
                dialogs.NewFileContentExtension = NewFileContentExtension;
            })(dialogs = ui.dialogs || (ui.dialogs = {}));
        })(ui = files.ui || (files.ui = {}));
    })(files = phasereditor2d.files || (phasereditor2d.files = {}));
})(phasereditor2d || (phasereditor2d = {}));
/// <reference path="./BaseNewFileDialog.ts" />
var phasereditor2d;
(function (phasereditor2d) {
    var files;
    (function (files) {
        var ui;
        (function (ui) {
            var dialogs;
            (function (dialogs) {
                class NewFileDialog extends dialogs.BaseNewFileDialog {
                    constructor() {
                        super();
                        this._fileExtension = "";
                        this._fileContent = "";
                    }
                    normalizedFileName() {
                        const name = super.normalizedFileName();
                        if (name.endsWith("." + this._fileExtension)) {
                            return name;
                        }
                        return name + "." + this._fileExtension;
                    }
                    setFileContent(fileContent) {
                        this._fileContent = fileContent;
                    }
                    setFileExtension(fileExtension) {
                        this._fileExtension = fileExtension;
                    }
                    createFile(folder, name) {
                        return colibri.ui.ide.FileUtils.createFile_async(folder, name, this._fileContent);
                    }
                }
                dialogs.NewFileDialog = NewFileDialog;
            })(dialogs = ui.dialogs || (ui.dialogs = {}));
        })(ui = files.ui || (files.ui = {}));
    })(files = phasereditor2d.files || (phasereditor2d.files = {}));
})(phasereditor2d || (phasereditor2d = {}));
var phasereditor2d;
(function (phasereditor2d) {
    var files;
    (function (files) {
        var ui;
        (function (ui) {
            var dialogs;
            (function (dialogs) {
                class NewFolderDialog extends dialogs.BaseNewFileDialog {
                    async createFile(container, name) {
                        const folder = await colibri.ui.ide.FileUtils.createFolder_async(container, name);
                        const window = colibri.Platform.getWorkbench().getActiveWindow();
                        const view = window.getView(ui.views.FilesView.ID);
                        view.getViewer().reveal(folder);
                        view.getViewer().setSelection([folder]);
                        view.getViewer().repaint();
                        return Promise.resolve(folder);
                    }
                }
                dialogs.NewFolderDialog = NewFolderDialog;
            })(dialogs = ui.dialogs || (ui.dialogs = {}));
        })(ui = files.ui || (files.ui = {}));
    })(files = phasereditor2d.files || (phasereditor2d.files = {}));
})(phasereditor2d || (phasereditor2d = {}));
var phasereditor2d;
(function (phasereditor2d) {
    var files;
    (function (files) {
        var ui;
        (function (ui) {
            var dialogs;
            (function (dialogs) {
                class NewFolderExtension extends dialogs.NewFileExtension {
                    constructor() {
                        super({
                            icon: colibri.Platform.getWorkbench().getWorkbenchIcon(colibri.ui.ide.ICON_FOLDER),
                            initialFileName: "folder",
                            wizardName: "Folder"
                        });
                    }
                    createDialog() {
                        const dlg = new dialogs.NewFolderDialog();
                        dlg.create();
                        return dlg;
                    }
                }
                dialogs.NewFolderExtension = NewFolderExtension;
            })(dialogs = ui.dialogs || (ui.dialogs = {}));
        })(ui = files.ui || (files.ui = {}));
    })(files = phasereditor2d.files || (phasereditor2d.files = {}));
})(phasereditor2d || (phasereditor2d = {}));
var phasereditor2d;
(function (phasereditor2d) {
    var files;
    (function (files) {
        var ui;
        (function (ui) {
            var viewers;
            (function (viewers) {
                class ContentTypeCellRendererExtension extends colibri.Extension {
                    constructor() {
                        super(ContentTypeCellRendererExtension.POINT_ID);
                    }
                }
                ContentTypeCellRendererExtension.POINT_ID = "phasereditor2d.files.ui.viewers.ContentTypeCellRendererExtension";
                viewers.ContentTypeCellRendererExtension = ContentTypeCellRendererExtension;
            })(viewers = ui.viewers || (ui.viewers = {}));
        })(ui = files.ui || (files.ui = {}));
    })(files = phasereditor2d.files || (phasereditor2d.files = {}));
})(phasereditor2d || (phasereditor2d = {}));
var phasereditor2d;
(function (phasereditor2d) {
    var files;
    (function (files) {
        var ui;
        (function (ui) {
            var viewers;
            (function (viewers_1) {
                var viewers = colibri.ui.controls.viewers;
                var controls = colibri.ui.controls;
                var ide = colibri.ui.ide;
                class FileCellRenderer extends viewers.IconImageCellRenderer {
                    constructor() {
                        super(null);
                    }
                    getIcon(obj) {
                        const file = obj;
                        if (file.isFile()) {
                            const ct = ide.Workbench.getWorkbench().getContentTypeRegistry().getCachedContentType(file);
                            const icon = ide.Workbench.getWorkbench().getContentTypeIcon(ct);
                            if (icon) {
                                return icon;
                            }
                        }
                        else {
                            return controls.Controls.getIcon(ide.ICON_FOLDER);
                        }
                        return controls.Controls.getIcon(ide.ICON_FILE);
                    }
                    preload(args) {
                        const obj = args.obj;
                        const file = obj;
                        if (file.isFile()) {
                            const result = ide.Workbench.getWorkbench().getContentTypeRegistry().preload(file);
                            return result;
                        }
                        return super.preload(args);
                    }
                }
                viewers_1.FileCellRenderer = FileCellRenderer;
            })(viewers = ui.viewers || (ui.viewers = {}));
        })(ui = files.ui || (files.ui = {}));
    })(files = phasereditor2d.files || (phasereditor2d.files = {}));
})(phasereditor2d || (phasereditor2d = {}));
var phasereditor2d;
(function (phasereditor2d) {
    var files;
    (function (files) {
        var ui;
        (function (ui) {
            var viewers;
            (function (viewers_2) {
                var ide = colibri.ui.ide;
                class FileCellRendererProvider {
                    constructor(layout = "tree") {
                        this._layout = layout;
                    }
                    getCellRenderer(file) {
                        const contentType = ide.Workbench.getWorkbench().getContentTypeRegistry().getCachedContentType(file);
                        const extensions = colibri.Platform.getExtensions(viewers_2.ContentTypeCellRendererExtension.POINT_ID);
                        for (const extension of extensions) {
                            const provider = extension.getRendererProvider(contentType);
                            if (provider !== null) {
                                return provider.getCellRenderer(file);
                            }
                        }
                        return new viewers_2.FileCellRenderer();
                    }
                    preload(file) {
                        return ide.Workbench.getWorkbench().getContentTypeRegistry().preload(file);
                    }
                }
                viewers_2.FileCellRendererProvider = FileCellRendererProvider;
            })(viewers = ui.viewers || (ui.viewers = {}));
        })(ui = files.ui || (files.ui = {}));
    })(files = phasereditor2d.files || (phasereditor2d.files = {}));
})(phasereditor2d || (phasereditor2d = {}));
var phasereditor2d;
(function (phasereditor2d) {
    var files;
    (function (files) {
        var ui;
        (function (ui) {
            var viewers;
            (function (viewers_3) {
                class FileLabelProvider {
                    getLabel(obj) {
                        return obj.getName();
                    }
                }
                viewers_3.FileLabelProvider = FileLabelProvider;
            })(viewers = ui.viewers || (ui.viewers = {}));
        })(ui = files.ui || (files.ui = {}));
    })(files = phasereditor2d.files || (phasereditor2d.files = {}));
})(phasereditor2d || (phasereditor2d = {}));
var phasereditor2d;
(function (phasereditor2d) {
    var files;
    (function (files_3) {
        var ui;
        (function (ui) {
            var viewers;
            (function (viewers) {
                var core = colibri.core;
                class FileTreeContentProvider {
                    constructor(onlyFolders = false) {
                        this._onlyFolders = onlyFolders;
                    }
                    getRoots(input) {
                        let result = [];
                        if (input instanceof core.io.FilePath) {
                            if (this._onlyFolders) {
                                if (!input.isFolder()) {
                                    return [];
                                }
                            }
                            return [input];
                        }
                        if (input instanceof Array) {
                            if (this._onlyFolders) {
                                return input.filter(f => f.isFolder());
                            }
                            return input;
                        }
                        return this.getChildren(input);
                    }
                    getChildren(parent) {
                        const files = parent.getFiles();
                        if (this._onlyFolders) {
                            return files.filter(f => f.isFolder());
                        }
                        return files;
                    }
                }
                viewers.FileTreeContentProvider = FileTreeContentProvider;
            })(viewers = ui.viewers || (ui.viewers = {}));
        })(ui = files_3.ui || (files_3.ui = {}));
    })(files = phasereditor2d.files || (phasereditor2d.files = {}));
})(phasereditor2d || (phasereditor2d = {}));
var phasereditor2d;
(function (phasereditor2d) {
    var files;
    (function (files) {
        var ui;
        (function (ui) {
            var viewers;
            (function (viewers) {
                var controls = colibri.ui.controls;
                class InputFileCellRendererProvider {
                    getCellRenderer(element) {
                        return new controls.viewers.IconImageCellRenderer(colibri.Platform.getWorkbench().getWorkbenchIcon(colibri.ui.ide.ICON_FILE));
                    }
                    preload(element) {
                        return controls.Controls.resolveNothingLoaded();
                    }
                }
                viewers.InputFileCellRendererProvider = InputFileCellRendererProvider;
            })(viewers = ui.viewers || (ui.viewers = {}));
        })(ui = files.ui || (files.ui = {}));
    })(files = phasereditor2d.files || (phasereditor2d.files = {}));
})(phasereditor2d || (phasereditor2d = {}));
var phasereditor2d;
(function (phasereditor2d) {
    var files;
    (function (files) {
        var ui;
        (function (ui) {
            var viewers;
            (function (viewers) {
                class InputFileLabelProvider {
                    getLabel(file) {
                        return file.name;
                    }
                }
                viewers.InputFileLabelProvider = InputFileLabelProvider;
            })(viewers = ui.viewers || (ui.viewers = {}));
        })(ui = files.ui || (files.ui = {}));
    })(files = phasereditor2d.files || (phasereditor2d.files = {}));
})(phasereditor2d || (phasereditor2d = {}));
var phasereditor2d;
(function (phasereditor2d) {
    var files;
    (function (files) {
        var ui;
        (function (ui) {
            var viewers;
            (function (viewers) {
                var controls = colibri.ui.controls;
                class Provider {
                    constructor(_renderer) {
                        this._renderer = _renderer;
                    }
                    getCellRenderer(element) {
                        return this._renderer;
                    }
                    preload(element) {
                        return controls.Controls.resolveNothingLoaded();
                    }
                }
                class SimpleContentTypeCellRendererExtension extends viewers.ContentTypeCellRendererExtension {
                    constructor(contentType, cellRenderer) {
                        super();
                        this._contentType = contentType;
                        this._cellRenderer = cellRenderer;
                    }
                    getRendererProvider(contentType) {
                        if (contentType === this._contentType) {
                            return new Provider(this._cellRenderer);
                        }
                        return null;
                    }
                }
                viewers.SimpleContentTypeCellRendererExtension = SimpleContentTypeCellRendererExtension;
            })(viewers = ui.viewers || (ui.viewers = {}));
        })(ui = files.ui || (files.ui = {}));
    })(files = phasereditor2d.files || (phasereditor2d.files = {}));
})(phasereditor2d || (phasereditor2d = {}));
var phasereditor2d;
(function (phasereditor2d) {
    var files;
    (function (files) {
        var ui;
        (function (ui) {
            var views;
            (function (views) {
                var controls = colibri.ui.controls;
                class FilePropertySectionProvider extends controls.properties.PropertySectionProvider {
                    addSections(page, sections) {
                        sections.push(new views.FileSection(page));
                        sections.push(new views.ImageFileSection(page));
                        sections.push(new views.ManyImageFileSection(page));
                        sections.push(new views.UploadSection(page));
                    }
                }
                views.FilePropertySectionProvider = FilePropertySectionProvider;
            })(views = ui.views || (ui.views = {}));
        })(ui = files.ui || (files.ui = {}));
    })(files = phasereditor2d.files || (phasereditor2d.files = {}));
})(phasereditor2d || (phasereditor2d = {}));
var phasereditor2d;
(function (phasereditor2d) {
    var files;
    (function (files) {
        var ui;
        (function (ui) {
            var views;
            (function (views) {
                var controls = colibri.ui.controls;
                var core = colibri.core;
                class FileSection extends controls.properties.PropertySection {
                    constructor(page) {
                        super(page, "files.FileSection", "File");
                    }
                    createForm(parent) {
                        const comp = this.createGridElement(parent, 2);
                        {
                            // Name
                            this.createLabel(comp, "Name");
                            const text = this.createText(comp, true);
                            this.addUpdater(() => {
                                text.value = this.flatValues_StringJoin(this.getSelection().map(file => file.getName()));
                            });
                        }
                        {
                            // Full Name
                            this.createLabel(comp, "Full Name");
                            const text = this.createText(comp, true);
                            this.addUpdater(() => {
                                text.value = this.flatValues_StringJoin(this.getSelection().map(file => file.getFullName()));
                            });
                        }
                        {
                            // Size
                            this.createLabel(comp, "Size");
                            const text = this.createText(comp, true);
                            this.addUpdater(() => {
                                let total = 0;
                                for (const file of this.getSelection()) {
                                    total += file.getSize();
                                }
                                text.value = total.toString();
                            });
                        }
                    }
                    canEdit(obj) {
                        return obj instanceof core.io.FilePath;
                    }
                    canEditNumber(n) {
                        return n > 0;
                    }
                }
                views.FileSection = FileSection;
            })(views = ui.views || (ui.views = {}));
        })(ui = files.ui || (files.ui = {}));
    })(files = phasereditor2d.files || (phasereditor2d.files = {}));
})(phasereditor2d || (phasereditor2d = {}));
var phasereditor2d;
(function (phasereditor2d) {
    var files;
    (function (files) {
        var ui;
        (function (ui) {
            var views;
            (function (views) {
                var controls = colibri.ui.controls;
                var ide = colibri.ui.ide;
                var io = colibri.core.io;
                class FilesView extends ide.ViewerView {
                    constructor() {
                        super(FilesView.ID);
                        this._propertyProvider = new views.FilePropertySectionProvider();
                        this.setTitle("Files");
                        this.setIcon(ide.Workbench.getWorkbench().getWorkbenchIcon(ide.ICON_FOLDER));
                    }
                    createViewer() {
                        return new controls.viewers.TreeViewer();
                    }
                    fillContextMenu(menu) {
                        const sel = this._viewer.getSelection();
                        menu.add(new ui.actions.NewFileAction(this));
                        menu.addSeparator();
                        menu.add(new ui.actions.RenameFileAction(this));
                        menu.add(new ui.actions.MoveFilesAction(this));
                        menu.add(new ui.actions.DeleteFilesAction(this));
                    }
                    getPropertyProvider() {
                        return this._propertyProvider;
                    }
                    createPart() {
                        super.createPart();
                        const wb = ide.Workbench.getWorkbench();
                        const root = wb.getProjectRoot();
                        const viewer = this._viewer;
                        viewer.setLabelProvider(new ui.viewers.FileLabelProvider());
                        viewer.setContentProvider(new ui.viewers.FileTreeContentProvider());
                        viewer.setCellRendererProvider(new ui.viewers.FileCellRendererProvider());
                        viewer.setInput(root);
                        viewer.repaint();
                        viewer.addEventListener(controls.viewers.EVENT_OPEN_ITEM, (e) => {
                            const file = e.detail;
                            if (file.isFolder()) {
                                return;
                            }
                            wb.openEditor(file);
                        });
                        wb.getFileStorage().addChangeListener(change => this.onFileStorageChange(change));
                        wb.addEventListener(ide.EVENT_EDITOR_ACTIVATED, e => {
                            const editor = wb.getActiveEditor();
                            if (editor) {
                                const input = editor.getInput();
                                if (input instanceof io.FilePath) {
                                    // gives it a time because other listeners need to do their job.
                                    viewer.setSelection([input]);
                                    viewer.reveal(input);
                                }
                            }
                        });
                    }
                    async onFileStorageChange(change) {
                        const viewer = this.getViewer();
                        const oldSelection = this.getViewer().getSelection();
                        viewer.setInput(ide.FileUtils.getRoot());
                        await viewer.repaint();
                        if (oldSelection.length > 0) {
                            const newSelection = oldSelection
                                .map(obj => obj)
                                .filter(file => {
                                const file2 = colibri.ui.ide.FileUtils.getFileFromPath(file.getFullName());
                                return file2 !== null;
                            });
                            if (newSelection.length !== oldSelection.length) {
                                this.getViewer().setSelection(newSelection);
                                this.getViewer().repaint();
                            }
                        }
                    }
                    getIcon() {
                        return controls.Controls.getIcon(ide.ICON_FOLDER);
                    }
                }
                FilesView.ID = "phasereditor2d.files.ui.views.FilesView";
                views.FilesView = FilesView;
            })(views = ui.views || (ui.views = {}));
        })(ui = files.ui || (files.ui = {}));
    })(files = phasereditor2d.files || (phasereditor2d.files = {}));
})(phasereditor2d || (phasereditor2d = {}));
var phasereditor2d;
(function (phasereditor2d) {
    var files;
    (function (files) {
        var ui;
        (function (ui) {
            var views;
            (function (views) {
                var controls = colibri.ui.controls;
                var ide = colibri.ui.ide;
                var core = colibri.core;
                class ImageFileSection extends controls.properties.PropertySection {
                    constructor(page) {
                        super(page, "files.ImagePreviewSection", "Image", true);
                    }
                    createForm(parent) {
                        parent.classList.add("ImagePreviewFormArea", "PreviewBackground");
                        const imgControl = new controls.ImageControl(ide.IMG_SECTION_PADDING);
                        this.getPage().addEventListener(controls.EVENT_CONTROL_LAYOUT, (e) => {
                            imgControl.resizeTo();
                        });
                        parent.appendChild(imgControl.getElement());
                        setTimeout(() => imgControl.resizeTo(), 1);
                        this.addUpdater(() => {
                            const file = this.getSelection()[0];
                            const img = ide.Workbench.getWorkbench().getFileImage(file);
                            imgControl.setImage(img);
                            setTimeout(() => imgControl.resizeTo(), 1);
                        });
                    }
                    canEdit(obj) {
                        if (obj instanceof core.io.FilePath) {
                            const ct = ide.Workbench.getWorkbench().getContentTypeRegistry().getCachedContentType(obj);
                            return ct === phasereditor2d.webContentTypes.core.CONTENT_TYPE_IMAGE || ct === phasereditor2d.webContentTypes.core.CONTENT_TYPE_SVG;
                        }
                        return false;
                    }
                    canEditNumber(n) {
                        return n == 1;
                    }
                }
                views.ImageFileSection = ImageFileSection;
            })(views = ui.views || (ui.views = {}));
        })(ui = files.ui || (files.ui = {}));
    })(files = phasereditor2d.files || (phasereditor2d.files = {}));
})(phasereditor2d || (phasereditor2d = {}));
var phasereditor2d;
(function (phasereditor2d) {
    var files;
    (function (files) {
        var ui;
        (function (ui) {
            var views;
            (function (views) {
                var controls = colibri.ui.controls;
                var ide = colibri.ui.ide;
                var core = colibri.core;
                class GridImageFileViewer extends controls.viewers.TreeViewer {
                    constructor(...classList) {
                        super("PreviewBackground", ...classList);
                        this.setContentProvider(new controls.viewers.ArrayTreeContentProvider());
                        this.setLabelProvider(new ui.viewers.FileLabelProvider());
                        this.setCellRendererProvider(new ui.viewers.FileCellRendererProvider());
                        this.setTreeRenderer(new controls.viewers.GridTreeViewerRenderer(this, false, true));
                        this.getCanvas().classList.add("PreviewBackground");
                    }
                }
                class ManyImageFileSection extends controls.properties.PropertySection {
                    constructor(page) {
                        super(page, "files.ManyImageFileSection", "Images", true);
                    }
                    createForm(parent) {
                        parent.classList.add("ManyImagePreviewFormArea");
                        const viewer = new GridImageFileViewer();
                        const filteredViewer = new ide.properties.FilteredViewerInPropertySection(this.getPage(), viewer);
                        parent.appendChild(filteredViewer.getElement());
                        this.addUpdater(() => {
                            // clean the viewer first
                            viewer.setInput([]);
                            viewer.repaint();
                            viewer.setInput(this.getSelection());
                            filteredViewer.resizeTo();
                        });
                    }
                    canEdit(obj) {
                        if (obj instanceof core.io.FilePath) {
                            const ct = ide.Workbench.getWorkbench().getContentTypeRegistry().getCachedContentType(obj);
                            return ct === phasereditor2d.webContentTypes.core.CONTENT_TYPE_IMAGE || ct === phasereditor2d.webContentTypes.core.CONTENT_TYPE_SVG;
                        }
                        return false;
                    }
                    canEditNumber(n) {
                        return n > 1;
                    }
                }
                views.ManyImageFileSection = ManyImageFileSection;
            })(views = ui.views || (ui.views = {}));
        })(ui = files.ui || (files.ui = {}));
    })(files = phasereditor2d.files || (phasereditor2d.files = {}));
})(phasereditor2d || (phasereditor2d = {}));
var phasereditor2d;
(function (phasereditor2d) {
    var files;
    (function (files_4) {
        var ui;
        (function (ui) {
            var views;
            (function (views) {
                var controls = colibri.ui.controls;
                var ide = colibri.ui.ide;
                var io = colibri.core.io;
                class UploadSection extends controls.properties.PropertySection {
                    constructor(page) {
                        super(page, "phasereditor2d.files.ui.views", "Upload", true);
                    }
                    createForm(parent) {
                        const comp = this.createGridElement(parent, 1);
                        comp.classList.add("UploadSection");
                        comp.style.display = "grid";
                        comp.style.gridTemplateColumns = "1fr";
                        comp.style.gridTemplateRows = "auto auto 1fr";
                        comp.style.gridGap = "5px";
                        const filesInput = document.createElement("input");
                        const browseBtn = document.createElement("button");
                        const uploadBtn = document.createElement("button");
                        const filesViewer = new controls.viewers.TreeViewer();
                        const filesFilteredViewer = new ide.properties.FilteredViewerInPropertySection(this.getPage(), filesViewer);
                        {
                            // browse button
                            browseBtn.innerText = "Browse";
                            browseBtn.style.alignItems = "start";
                            browseBtn.addEventListener("click", e => filesInput.click());
                        }
                        {
                            // file list
                            filesViewer.setLabelProvider(new ui.viewers.InputFileLabelProvider());
                            filesViewer.setCellRendererProvider(new ui.viewers.InputFileCellRendererProvider());
                            filesViewer.setContentProvider(new controls.viewers.ArrayTreeContentProvider());
                            filesViewer.setInput([]);
                            this.addUpdater(() => {
                                filesViewer.setInput([]);
                                filesViewer.repaint();
                            });
                        }
                        {
                            filesInput.type = "file";
                            filesInput.name = "files";
                            filesInput.multiple = true;
                            filesInput.addEventListener("change", e => {
                                const files = filesInput.files;
                                const input = [];
                                for (let i = 0; i < files.length; i++) {
                                    input.push(files.item(i));
                                }
                                filesViewer.setInput(input);
                                filesViewer.repaint();
                                uploadBtn.disabled = input.length === 0;
                            });
                            this.addUpdater(() => {
                                filesInput.value = "";
                            });
                            {
                                // submit button
                                uploadBtn.disabled = true;
                                uploadBtn.innerText = "Upload";
                                uploadBtn.addEventListener("click", async (e) => {
                                    const input = filesViewer.getInput();
                                    const files = input.slice();
                                    const uploadFolder = this.getSelection()[0];
                                    const cancelFlag = {
                                        canceled: false
                                    };
                                    const dlg = new controls.dialogs.ProgressDialog();
                                    dlg.create();
                                    dlg.setTitle("Uploading");
                                    dlg.setCloseWithEscapeKey(false);
                                    {
                                        const btn = dlg.addButton("Cancel", () => {
                                            if (cancelFlag.canceled) {
                                                return;
                                            }
                                            cancelFlag.canceled = true;
                                            btn.innerText = "Canceling";
                                        });
                                    }
                                    dlg.setProgress(0);
                                    const ioFiles = [];
                                    for (const file of files) {
                                        if (cancelFlag.canceled) {
                                            dlg.close();
                                            break;
                                        }
                                        try {
                                            const ioFile = await colibri.ui.ide.FileUtils.uploadFile_async(uploadFolder, file);
                                            ioFiles.push(ioFile);
                                        }
                                        catch (error) {
                                            break;
                                        }
                                        input.shift();
                                        filesViewer.repaint();
                                        dlg.setProgress(1 - (input.length / files.length));
                                    }
                                    dlg.close();
                                    uploadBtn.disabled = filesViewer.getInput().length === 0;
                                    if (ioFiles.length > 0) {
                                        const view = colibri.ui.ide.Workbench
                                            .getWorkbench()
                                            .getActiveWindow()
                                            .getView(views.FilesView.ID);
                                        view.getViewer().setSelection(ioFiles);
                                        view.getViewer().reveal(ioFiles[0]);
                                        view.getViewer().repaint();
                                    }
                                });
                            }
                        }
                        comp.appendChild(browseBtn);
                        comp.appendChild(uploadBtn);
                        comp.appendChild(filesFilteredViewer.getElement());
                        comp.appendChild(filesInput);
                    }
                    canEdit(obj, n) {
                        return obj instanceof io.FilePath && obj.isFolder();
                    }
                    canEditNumber(n) {
                        return n === 1;
                    }
                }
                views.UploadSection = UploadSection;
            })(views = ui.views || (ui.views = {}));
        })(ui = files_4.ui || (files_4.ui = {}));
    })(files = phasereditor2d.files || (phasereditor2d.files = {}));
})(phasereditor2d || (phasereditor2d = {}));
