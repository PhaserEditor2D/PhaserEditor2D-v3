var phasereditor2d;
(function (phasereditor2d) {
    var files;
    (function (files) {
        var ide = colibri.ui.ide;
        class FilesPlugin extends colibri.Plugin {
            static _instance = new FilesPlugin();
            _openFileAction;
            static getInstance() {
                return this._instance;
            }
            constructor() {
                super("phasereditor2d.files");
            }
            setOpenFileAction(action) {
                this._openFileAction = action;
            }
            getOpenFileAction() {
                return this._openFileAction;
            }
            getFileStyledLabelExtensions() {
                return colibri.Platform.getExtensions(files.ui.viewers.StyledFileLabelProviderExtension.POINT_ID);
            }
            registerExtensions(reg) {
                // new files
                reg.addExtension(new files.ui.dialogs.NewFolderExtension(), new files.ui.dialogs.NewGenericFileExtension());
                // commands
                reg.addExtension(new ide.commands.CommandExtension(files.ui.actions.FilesViewCommands.registerCommands));
                // properties
                reg.addExtension(new files.ui.views.FilePropertySectionExtension(page => new files.ui.views.FileSection(page), page => new files.ui.views.ImageFileSection(page), page => new files.ui.views.ManyImageFileSection(page), page => new files.ui.views.UploadSection(page)));
                // sections
                reg.addExtension(new files.ui.views.ContentTypeSectionExtension({
                    contentType: phasereditor2d.webContentTypes.core.CONTENT_TYPE_AUDIO,
                    section: files.ui.views.TAB_SECTION_ASSETS
                }, {
                    contentType: phasereditor2d.webContentTypes.core.CONTENT_TYPE_IMAGE,
                    section: files.ui.views.TAB_SECTION_ASSETS
                }, {
                    contentType: phasereditor2d.webContentTypes.core.CONTENT_TYPE_SVG,
                    section: files.ui.views.TAB_SECTION_ASSETS
                }, {
                    contentType: phasereditor2d.webContentTypes.core.CONTENT_TYPE_VIDEO,
                    section: files.ui.views.TAB_SECTION_ASSETS
                }));
            }
        }
        files.FilesPlugin = FilesPlugin;
        colibri.Platform.addPlugin(FilesPlugin.getInstance());
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
                class CopyFilesAction extends colibri.ui.ide.actions.ViewerViewAction {
                    constructor(view) {
                        super(view, {
                            text: "Copy To"
                        });
                    }
                    run() {
                        const rootFolder = colibri.ui.ide.FileUtils.getRoot();
                        const viewer = new controls.viewers.TreeViewer("phasereditor2d.files.ui.actions.CopyFilesAction");
                        viewer.setLabelProvider(new ui.viewers.FileLabelProvider());
                        viewer.setCellRendererProvider(new ui.viewers.FileCellRendererProvider());
                        viewer.setContentProvider(new ui.viewers.FileTreeContentProvider(true));
                        viewer.setInput(rootFolder);
                        viewer.setExpanded(rootFolder, true);
                        const dlg = new controls.dialogs.ViewerDialog(viewer, false);
                        dlg.create();
                        dlg.setTitle("Copy Files");
                        {
                            const btn = dlg.addButton("Copy", async () => {
                                const dstFile = viewer.getSelectionFirstElement();
                                const srcFiles = this.getViewViewer().getSelection();
                                const progressDlg = new controls.dialogs.ProgressDialog();
                                progressDlg.create();
                                progressDlg.setTitle("Copy");
                                const monitor = new controls.dialogs.ProgressDialogMonitor(progressDlg);
                                monitor.addTotal(srcFiles.length);
                                let lastAddedFile;
                                for (const file of srcFiles) {
                                    lastAddedFile = await colibri.ui.ide.FileUtils.copyFile_async(file, dstFile);
                                    monitor.step();
                                }
                                progressDlg.close();
                                if (lastAddedFile) {
                                    this.getViewViewer().reveal(lastAddedFile);
                                }
                                this.getViewViewer().repaint();
                                dlg.close();
                                phasereditor2d.blocks.BlocksPlugin.getInstance().refreshBlocksView();
                            });
                            btn.disabled = true;
                            viewer.eventSelectionChanged.addListener(() => {
                                const sel = viewer.getSelection();
                                let enabled = true;
                                if (sel.length !== 1) {
                                    enabled = false;
                                }
                                else {
                                    const copyTo = sel[0];
                                    for (const obj of this.getViewViewerSelection()) {
                                        const file = obj;
                                        if (copyTo.getFullName().startsWith(file.getFullName())) {
                                            enabled = false;
                                            break;
                                        }
                                    }
                                }
                                btn.disabled = !enabled;
                            });
                        }
                        dlg.addButton("Cancel", () => dlg.close());
                    }
                }
                actions.CopyFilesAction = CopyFilesAction;
            })(actions = ui.actions || (ui.actions = {}));
        })(ui = files.ui || (files.ui = {}));
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
                            commandId: colibri.ui.ide.actions.CMD_DELETE,
                            enabled: DeleteFilesAction.isEnabled(view)
                        });
                    }
                    async run() {
                        const files = this.getViewViewerSelection();
                        if (confirm(`Do you want to delete ${files.length} files?\This operation cannot be undone.`)) {
                            if (files.length > 0) {
                                await colibri.ui.ide.FileUtils.deleteFiles_async(files);
                                phasereditor2d.blocks.BlocksPlugin.getInstance().refreshBlocksView();
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
                var controls = colibri.ui.controls;
                actions.CMD_NEW_FILE = "phasereditor2d.files.ui.actions.NewFile";
                actions.CMD_GO_TO_FILE = "phasereditor2d.files.ui.actions.GoToFile";
                actions.CAT_FILES = "phasereditor2d.fines.ui.actions.FilesCategory";
                function isFilesViewScope(args) {
                    return args.activePart instanceof ui.views.FilesView;
                }
                class FilesViewCommands {
                    static registerCommands(manager) {
                        manager.addCategory({
                            id: actions.CAT_FILES,
                            name: "Files"
                        });
                        // new file
                        manager.addCommandHelper({
                            id: actions.CMD_NEW_FILE,
                            name: "New File",
                            tooltip: "Create new content.",
                            category: actions.CAT_FILES
                        });
                        manager.addHandlerHelper(actions.CMD_NEW_FILE, actions.OpenNewFileDialogAction.commandTest, args => {
                            new actions.OpenNewFileDialogAction().run();
                        });
                        manager.addKeyBinding(actions.CMD_NEW_FILE, new colibri.ui.ide.commands.KeyMatcher({
                            control: true,
                            alt: true,
                            key: "KeyN",
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
                        // go to file
                        manager.add({
                            command: {
                                id: actions.CMD_GO_TO_FILE,
                                name: "Go To File",
                                tooltip: "Search for a file and open it in the default editor",
                                category: actions.CAT_FILES
                            },
                            keys: {
                                control: true,
                                key: "KeyP"
                            },
                            handler: {
                                executeFunc: args => {
                                    const viewer = new controls.viewers.TreeViewer("phasereditor2d.files.ui.actions.GoToFile");
                                    viewer.setContentProvider(new controls.viewers.ArrayTreeContentProvider());
                                    viewer.setStyledLabelProvider(new ui.viewers.OpenFileLabelProvider());
                                    viewer.setCellRendererProvider(new ui.viewers.FileCellRendererProvider());
                                    viewer.setInput(colibri.ui.ide.FileUtils.getAllFiles()
                                        .filter(f => f.isFile())
                                        .sort((a, b) => -(a.getModTime() - b.getModTime())));
                                    const dlg = new controls.dialogs.ViewerDialog(viewer, true);
                                    dlg.setSize(dlg.getSize().width * 1.5, dlg.getSize().height * 1.5);
                                    dlg.create();
                                    dlg.setTitle("Go To File");
                                    dlg.addOpenButton("Open", sel => {
                                        if (sel.length > 0) {
                                            const file = sel[0];
                                            colibri.Platform.getWorkbench().openEditor(file);
                                        }
                                    });
                                }
                            }
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
                        const viewer = new controls.viewers.TreeViewer("phasereditor2d.files.ui.actions.MoveFilesAction");
                        viewer.setLabelProvider(new ui.viewers.FileLabelProvider());
                        viewer.setCellRendererProvider(new ui.viewers.FileCellRendererProvider());
                        viewer.setContentProvider(new ui.viewers.FileTreeContentProvider(true));
                        viewer.setInput(rootFolder);
                        viewer.setExpanded(rootFolder, true);
                        const dlg = new controls.dialogs.ViewerDialog(viewer, false);
                        dlg.create();
                        dlg.setTitle("Move Files");
                        {
                            const btn = dlg.addButton("Move", async () => {
                                const moveTo = viewer.getSelectionFirstElement();
                                const movingFiles = this.getViewViewer().getSelection();
                                await colibri.ui.ide.FileUtils.moveFiles_async(movingFiles, moveTo);
                                this.getViewViewer().reveal(movingFiles[0]);
                                this.getViewViewer().repaint();
                                phasereditor2d.blocks.BlocksPlugin.getInstance().refreshBlocksView();
                                dlg.close();
                            });
                            btn.disabled = true;
                            viewer.eventSelectionChanged.addListener(() => {
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
                            commandId: actions.CMD_NEW_FILE,
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
                    _initialLocation;
                    constructor() {
                        super({
                            commandId: actions.CMD_NEW_FILE,
                            showText: false,
                            icon: phasereditor2d.resources.getIcon(phasereditor2d.resources.ICON_NEW_FILE)
                        });
                    }
                    static commandTest(args) {
                        const root = colibri.ui.ide.FileUtils.getRoot();
                        return root !== null && !args.activeDialog;
                    }
                    async run() {
                        const viewer = new controls.viewers.TreeViewer("phasereditor2d.files.ui.actions.OpenNewFileDialogAction");
                        viewer.setLabelProvider(new WizardLabelProvider());
                        viewer.setContentProvider(new controls.viewers.ArrayTreeContentProvider());
                        viewer.setCellRendererProvider(new WizardCellRendererProvider());
                        const extensions = colibri.Platform.getExtensionRegistry()
                            .getExtensions(files.ui.dialogs.NewDialogExtension.POINT_ID);
                        viewer.setInput(extensions);
                        const dlg = new controls.dialogs.ViewerDialog(viewer, false);
                        dlg.create();
                        dlg.setTitle("New");
                        {
                            const selectCallback = () => {
                                dlg.close();
                                this.openDialog(viewer.getSelectionFirstElement());
                            };
                            const btn = dlg.addButton("Select", () => selectCallback());
                            btn.disabled = true;
                            viewer.eventSelectionChanged.addListener(() => {
                                btn.disabled = viewer.getSelection().length !== 1;
                            });
                            viewer.eventOpenItem.addListener(() => selectCallback());
                        }
                        dlg.addButton("Cancel", () => dlg.close());
                    }
                    openDialog(extension) {
                        const dlg = extension.createDialog({
                            initialFileLocation: this._initialLocation
                        });
                        dlg.setTitle(`New ${extension.getDialogName()}`);
                        // const ext = extension as dialogs.NewFileExtension;
                        // dlg.setInitialFileName(ext.getInitialFileName());
                        // dlg.setInitialLocation(this._initialLocation ?? ext.getInitialFileLocation());
                        // dlg.validate();
                    }
                    setInitialLocation(folder) {
                        this._initialLocation = folder;
                    }
                }
                actions.OpenNewFileDialogAction = OpenNewFileDialogAction;
                class WizardLabelProvider {
                    getLabel(obj) {
                        return obj.getDialogName();
                    }
                }
                class WizardCellRendererProvider {
                    getCellRenderer(element) {
                        const ext = element;
                        return new controls.viewers.IconImageCellRenderer(ext.getDialogIcon());
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
                            commandId: colibri.ui.ide.actions.CMD_RENAME,
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
                            if (value.indexOf("/") >= 0) {
                                return false;
                            }
                            if (parent) {
                                const file2 = parent.getFile(value) ?? null;
                                return file2 === null;
                            }
                            return false;
                        });
                        dlg.setResultCallback(result => {
                            colibri.ui.ide.FileUtils.renameFile_async(file, result);
                            phasereditor2d.blocks.BlocksPlugin.getInstance().refreshBlocksView();
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
            var actions;
            (function (actions) {
                var io = colibri.core.io;
                class UploadFilesAction extends colibri.ui.ide.actions.ViewerViewAction {
                    constructor(view) {
                        super(view, {
                            text: "Upload Files"
                        });
                    }
                    run() {
                        let folder = this.getViewViewer().getSelectionFirstElement();
                        if (folder instanceof io.FilePath) {
                            if (folder.isFile()) {
                                folder = folder.getParent();
                            }
                        }
                        else {
                            folder = colibri.ui.ide.FileUtils.getRoot();
                        }
                        const dlg = new ui.dialogs.UploadDialog(folder);
                        dlg.create();
                    }
                }
                actions.UploadFilesAction = UploadFilesAction;
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
                    _filteredViewer;
                    _fileNameText;
                    _createBtn;
                    _fileCreatedCallback;
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
                            this._filteredViewer.getViewer().eventSelectionChanged.addListener(() => {
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
                    getFileCreatedCallback() {
                        return this._fileCreatedCallback;
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
                        this.connectInputWithButton(this._fileNameText, this._createBtn);
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
                        const viewer = new viewers.TreeViewer("phasereditor2d.files.ui.dialogs.BaseNewFileDialog");
                        viewer.setLabelProvider(new files.ui.viewers.FileLabelProvider());
                        viewer.setContentProvider(new files.ui.viewers.FileTreeContentProvider(true));
                        viewer.setCellRendererProvider(new files.ui.viewers.FileCellRendererProvider());
                        viewer.setInput(colibri.Platform.getWorkbench().getProjectRoot());
                        viewer.eventSelectionChanged.addListener(() => {
                            this.validate();
                        });
                        this._filteredViewer = new viewers.FilteredViewerInElement(viewer, false);
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
    (function (files) {
        var ui;
        (function (ui) {
            var dialogs;
            (function (dialogs) {
                class NewDialogExtension extends colibri.Extension {
                    static POINT_ID = "phasereditor2d.files.ui.dialogs.NewDialogExtension";
                    _dialogName;
                    _dialogIconDescriptor;
                    constructor(config) {
                        super(NewDialogExtension.POINT_ID);
                        this._dialogName = config.dialogName;
                        this._dialogIconDescriptor = config.dialogIconDescriptor;
                    }
                    getDialogName() {
                        return this._dialogName;
                    }
                    getDialogIcon() {
                        return this._dialogIconDescriptor.getIcon();
                    }
                }
                dialogs.NewDialogExtension = NewDialogExtension;
            })(dialogs = ui.dialogs || (ui.dialogs = {}));
        })(ui = files.ui || (files.ui = {}));
    })(files = phasereditor2d.files || (phasereditor2d.files = {}));
})(phasereditor2d || (phasereditor2d = {}));
/// <reference path="./NewDialogExtension.ts" />
var phasereditor2d;
(function (phasereditor2d) {
    var files;
    (function (files_2) {
        var ui;
        (function (ui) {
            var dialogs;
            (function (dialogs) {
                class NewFileExtension extends dialogs.NewDialogExtension {
                    _initialFileName;
                    constructor(config) {
                        super(config);
                        this._initialFileName = config.initialFileName;
                    }
                    getInitialFileName() {
                        return this._initialFileName;
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
                    _fileExtension;
                    _openInEditor;
                    _createdCallback;
                    constructor(config) {
                        super(config);
                        this._fileExtension = config.fileExtension;
                        this._openInEditor = true;
                    }
                    isOpenInEditor() {
                        return this._openInEditor;
                    }
                    setOpenInEditor(openInEditor) {
                        this._openInEditor = openInEditor;
                    }
                    getCreatedCallback() {
                        return this._createdCallback;
                    }
                    setCreatedCallback(callback) {
                        this._createdCallback = callback;
                    }
                    createDialog(args) {
                        const dlg = new files.ui.dialogs.NewFileDialog();
                        dlg.create();
                        dlg.setFileExtension(this._fileExtension);
                        dlg.setCreateFileContent(this.getCreateFileContentFunc());
                        dlg.setFileCreatedCallback(async (file) => {
                            const wb = colibri.Platform.getWorkbench();
                            const reg = wb.getContentTypeRegistry();
                            await reg.preload(file);
                            if (this._openInEditor) {
                                wb.openEditor(file);
                            }
                            if (this._createdCallback) {
                                this._createdCallback(file);
                            }
                        });
                        dlg.setInitialFileName(this.getInitialFileName());
                        dlg.setInitialLocation(args.initialFileLocation ?? this.getInitialFileLocation());
                        dlg.validate();
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
                    _fileExtension;
                    _createFileContentFunc;
                    constructor() {
                        super();
                        this._fileExtension = "";
                        this._createFileContentFunc = args => "";
                    }
                    normalizedFileName() {
                        const name = super.normalizedFileName();
                        if (this._fileExtension === "") {
                            return name;
                        }
                        if (name.endsWith("." + this._fileExtension)) {
                            return name;
                        }
                        return name + "." + this._fileExtension;
                    }
                    setCreateFileContent(createFileContent) {
                        this._createFileContentFunc = createFileContent;
                    }
                    setFileExtension(fileExtension) {
                        this._fileExtension = fileExtension;
                    }
                    createFile(folder, name) {
                        const content = this._createFileContentFunc({
                            folder,
                            fileName: name
                        });
                        return colibri.ui.ide.FileUtils.createFile_async(folder, name, content);
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
                            dialogName: "Folder",
                            dialogIconDescriptor: colibri.ColibriPlugin.getInstance().getIconDescriptor(colibri.ICON_FOLDER),
                            initialFileName: "folder"
                        });
                    }
                    createDialog(args) {
                        const dlg = new dialogs.NewFolderDialog();
                        dlg.create();
                        dlg.setInitialFileName(this.getInitialFileName());
                        dlg.setInitialLocation(args.initialFileLocation ?? this.getInitialFileLocation());
                        dlg.validate();
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
            var dialogs;
            (function (dialogs) {
                class NewGenericFileExtension extends dialogs.NewFileContentExtension {
                    constructor() {
                        super({
                            fileExtension: "",
                            dialogIconDescriptor: colibri.ColibriPlugin.getInstance().getIconDescriptor(colibri.ICON_FILE),
                            initialFileName: "Untitled",
                            dialogName: "File"
                        });
                    }
                    getCreateFileContentFunc() {
                        return args => "";
                    }
                }
                dialogs.NewGenericFileExtension = NewGenericFileExtension;
            })(dialogs = ui.dialogs || (ui.dialogs = {}));
        })(ui = files.ui || (files.ui = {}));
    })(files = phasereditor2d.files || (phasereditor2d.files = {}));
})(phasereditor2d || (phasereditor2d = {}));
var phasereditor2d;
(function (phasereditor2d) {
    var files;
    (function (files_3) {
        var ui;
        (function (ui) {
            var dialogs;
            (function (dialogs) {
                var controls = colibri.ui.controls;
                class UploadDialog extends controls.dialogs.ViewerDialog {
                    _uploadFolder;
                    _uploadBtnElement;
                    constructor(uploadFolder) {
                        super(new controls.viewers.TreeViewer("phasereditor2d.files.ui.dialogs.UploadDialog"), false);
                        this._uploadFolder = uploadFolder;
                    }
                    async create() {
                        const filesViewer = this.getViewer();
                        filesViewer.setLabelProvider(new ui.viewers.InputFileLabelProvider());
                        filesViewer.setCellRendererProvider(new ui.viewers.InputFileCellRendererProvider());
                        filesViewer.setContentProvider(new controls.viewers.ArrayTreeContentProvider());
                        filesViewer.setInput([]);
                        const dropArea = filesViewer.getElement();
                        const preventDefaults = (e) => {
                            e.preventDefault();
                            e.stopPropagation();
                        };
                        ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
                            dropArea.addEventListener(eventName, preventDefaults, false);
                        });
                        dropArea.addEventListener("dragenter", e => {
                            dropArea.classList.add("FilesDragEnter");
                        });
                        dropArea.addEventListener("dragleave", e => {
                            dropArea.classList.remove("FilesDragEnter");
                        });
                        filesViewer.getElement().addEventListener("drop", e => {
                            dropArea.classList.remove("FilesDragEnter");
                            this.prepareFilesForUpload(e.dataTransfer.files);
                        });
                        super.create();
                        const filesInputElement = document.createElement("input");
                        this.setTitle("Upload Files");
                        this._uploadBtnElement = super.addButton("Upload", () => { });
                        this._uploadBtnElement.disabled = true;
                        this._uploadBtnElement.innerText = "Upload";
                        this._uploadBtnElement.addEventListener("click", async (e) => {
                            const input = filesViewer.getInput();
                            const files = input.slice();
                            const uploadFolder = this._uploadFolder;
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
                            if (ioFiles.length > 0) {
                                const wb = colibri.ui.ide.Workbench.getWorkbench();
                                for (const file of ioFiles) {
                                    await wb.getContentTypeRegistry().preload(file);
                                }
                                const view = wb.getActiveWindow()
                                    .getView(ui.views.FilesView.ID);
                                view.getViewer().setSelection(ioFiles);
                                view.getViewer().reveal(ioFiles[0]);
                                view.getViewer().repaint();
                            }
                            this.close();
                            phasereditor2d.blocks.BlocksPlugin.getInstance().refreshBlocksView();
                        });
                        super.addButton("Browse", () => {
                            filesInputElement.click();
                        });
                        filesInputElement.type = "file";
                        filesInputElement.name = "files";
                        filesInputElement.multiple = true;
                        filesInputElement.addEventListener("change", e => {
                            const files = filesInputElement.files;
                            this.prepareFilesForUpload(files);
                        });
                        super.addButton("Cancel", () => this.close());
                    }
                    prepareFilesForUpload(files) {
                        const newFiles = [];
                        for (let i = 0; i < files.length; i++) {
                            const file = files.item(i);
                            newFiles.push(file);
                        }
                        const input = this.getViewer().getInput();
                        input.push(...newFiles);
                        this.getViewer().setInput(input);
                        this.getViewer().repaint();
                        this._uploadBtnElement.disabled = input.length === 0;
                        this._uploadBtnElement.textContent = input.length === 0 ? "Upload" : "Upload " + input.length + " Files";
                    }
                }
                dialogs.UploadDialog = UploadDialog;
            })(dialogs = ui.dialogs || (ui.dialogs = {}));
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
                class ContentTypeCellRendererExtension extends colibri.Extension {
                    static POINT_ID = "phasereditor2d.files.ui.viewers.ContentTypeCellRendererExtension";
                    constructor() {
                        super(ContentTypeCellRendererExtension.POINT_ID);
                    }
                }
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
                            if (file.getParent()) {
                                return colibri.ColibriPlugin.getInstance().getIcon(colibri.ICON_FOLDER);
                            }
                            return phasereditor2d.resources.getIcon(phasereditor2d.resources.ICON_PROJECT);
                        }
                        return colibri.ColibriPlugin.getInstance().getIcon(colibri.ICON_FILE);
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
                    _layout;
                    constructor(layout = "tree") {
                        this._layout = layout;
                    }
                    getCellRenderer(file) {
                        const contentType = ide.Workbench.getWorkbench().getContentTypeRegistry().getCachedContentType(file);
                        const extensions = colibri.Platform
                            .getExtensions(viewers_2.ContentTypeCellRendererExtension.POINT_ID);
                        for (const extension of extensions) {
                            const provider = extension.getRendererProvider(contentType);
                            if (provider !== null) {
                                return provider.getCellRenderer(file);
                            }
                        }
                        return new viewers_2.FileCellRenderer();
                    }
                    preload(args) {
                        return ide.Workbench.getWorkbench().getContentTypeRegistry().preload(args.obj);
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
                    _folderFullPath;
                    constructor(folderFullPath = false) {
                        this._folderFullPath = folderFullPath;
                    }
                    getLabel(file) {
                        if (this._folderFullPath && file.isFolder()) {
                            return file.getProjectRelativeName();
                        }
                        return file.getName();
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
    (function (files) {
        var ui;
        (function (ui) {
            var viewers;
            (function (viewers) {
                var controls = colibri.ui.controls;
                class OpenFileLabelProvider {
                    getStyledTexts(file, dark) {
                        const theme = controls.Controls.getTheme();
                        const result = [
                            {
                                text: file.getName(),
                                color: theme.viewerForeground
                            }
                        ];
                        if (file.getParent()) {
                            let path = file.getParent().getProjectRelativeName();
                            if (path.startsWith("/")) {
                                path = " - " + path.substring(1);
                            }
                            if (path !== "") {
                                result.push({
                                    text: path,
                                    color: theme.viewerForeground + "90"
                                });
                            }
                        }
                        return result;
                    }
                }
                viewers.OpenFileLabelProvider = OpenFileLabelProvider;
            })(viewers = ui.viewers || (ui.viewers = {}));
        })(ui = files.ui || (files.ui = {}));
    })(files = phasereditor2d.files || (phasereditor2d.files = {}));
})(phasereditor2d || (phasereditor2d = {}));
var phasereditor2d;
(function (phasereditor2d) {
    var files;
    (function (files_4) {
        var ui;
        (function (ui) {
            var viewers;
            (function (viewers) {
                var core = colibri.core;
                class FileTreeContentProvider {
                    _onlyFolders;
                    constructor(onlyFolders = false) {
                        this._onlyFolders = onlyFolders;
                    }
                    getRoots(input) {
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
                        if (input === undefined || input === null) {
                            return [];
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
        })(ui = files_4.ui || (files_4.ui = {}));
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
                        return new controls.viewers.IconImageCellRenderer(colibri.Platform.getWorkbench().getWorkbenchIcon(colibri.ICON_FILE));
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
                    _renderer;
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
                    _contentType;
                    _cellRenderer;
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
            var viewers;
            (function (viewers) {
                var controls = colibri.ui.controls;
                class StyledFileLabelProvider {
                    getStyledTexts(file, dark) {
                        const theme = controls.Controls.getTheme();
                        const extensions = files.FilesPlugin.getInstance().getFileStyledLabelExtensions();
                        for (const ext of extensions) {
                            const styles = ext.getStyledText(file);
                            if (styles) {
                                return styles;
                            }
                        }
                        if (file.getName() === "publicroot") {
                            return [{
                                    text: file.getName(),
                                    color: dark ? "red" : "brown"
                                }];
                        }
                        if (file.isFolder() && file.getFile("publicroot")) {
                            return [{
                                    text: file.getName(),
                                    color: theme.viewerForeground
                                }, {
                                    text: " > public root",
                                    color: dark ? "lightGreen" : "darkGreen"
                                }];
                        }
                        return [{
                                text: file.getName(),
                                color: theme.viewerForeground
                            }];
                    }
                }
                viewers.StyledFileLabelProvider = StyledFileLabelProvider;
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
                class StyledFileLabelProviderExtension extends colibri.Extension {
                    static POINT_ID = "phasereditor2d.files.ui.views.FileStyledLabelProviderExtension";
                    constructor() {
                        super(StyledFileLabelProviderExtension.POINT_ID);
                    }
                }
                viewers.StyledFileLabelProviderExtension = StyledFileLabelProviderExtension;
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
                class ContentTypeSectionExtension extends colibri.Extension {
                    static POINT_ID = "phasereditor2d.files.ui.views.ContentTypeSectionExtension";
                    _assoc;
                    static withContentType(contentType, ...sections) {
                        return new ContentTypeSectionExtension(...sections.map(section => ({ contentType, section })));
                    }
                    static withSection(section, ...contentTypes) {
                        return new ContentTypeSectionExtension(...contentTypes.map(contentType => ({ contentType, section })));
                    }
                    constructor(...assoc) {
                        super(ContentTypeSectionExtension.POINT_ID);
                        this._assoc = assoc;
                    }
                    isContentTypeSupportedBySection(contentType, section) {
                        const assoc = this._assoc.find(a => a.contentType === contentType && a.section === section);
                        return assoc !== undefined;
                    }
                }
                views.ContentTypeSectionExtension = ContentTypeSectionExtension;
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
                class FilePropertySectionExtension extends colibri.Extension {
                    static POINT_ID = "phasereditor2d.files.ui.views.FilePropertySectionExtension";
                    _sectionProviders;
                    constructor(...sectionProviders) {
                        super(FilePropertySectionExtension.POINT_ID);
                        this._sectionProviders = sectionProviders;
                    }
                    getSectionProviders() {
                        return this._sectionProviders;
                    }
                }
                views.FilePropertySectionExtension = FilePropertySectionExtension;
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
                class FilePropertySectionProvider extends controls.properties.PropertySectionProvider {
                    addSections(page, sections) {
                        const exts = colibri.Platform
                            .getExtensions(views.FilePropertySectionExtension.POINT_ID);
                        for (const ext of exts) {
                            for (const provider of ext.getSectionProviders()) {
                                const section = provider(page);
                                if (this.acceptSection(section)) {
                                    sections.push(section);
                                }
                            }
                        }
                        this.sortSections(sections);
                    }
                    acceptSection(section) {
                        return true;
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
                                text.value = filesize(total);
                            });
                        }
                        {
                            // Open
                            const btn = this.createButton(comp, "Open File", () => {
                                for (const file of this.getSelection()) {
                                    colibri.Platform.getWorkbench().openEditor(file);
                                }
                            });
                            btn.style.gridColumn = "1 / span 2";
                            btn.style.justifySelf = "end";
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
                views.TAB_SECTION_DESIGN = "Design";
                views.TAB_SECTION_ASSETS = "Assets";
                views.TAB_SECTIONS = [views.TAB_SECTION_DESIGN, views.TAB_SECTION_ASSETS];
                class FilesView extends ide.ViewerView {
                    static ID = "phasereditor2d.files.ui.views.FilesView";
                    static MENU_ID = "phasereditor2d.files.ui.views.FilesView#ContextMenu";
                    _propertyProvider = new views.FilePropertySectionProvider();
                    constructor() {
                        super(FilesView.ID);
                        this.setTitle("Files");
                        this.setIcon(ide.Workbench.getWorkbench().getWorkbenchIcon(colibri.ICON_FOLDER));
                    }
                    onPartAdded() {
                        super.onPartActivated();
                        const folder = this.getPartFolder();
                        const label = folder.getLabelFromContent(this);
                        for (const section of views.TAB_SECTIONS) {
                            folder.addTabSection(label, section, this.getId());
                        }
                        folder.eventTabSectionSelected.addListener(async (section) => {
                            const provider = section ? new FilteredContentProvider(section)
                                : new ui.viewers.FileTreeContentProvider();
                            // await colibri.Platform.getWorkbench().getFileStorage().getRoot().visitAsync(async (file) => {
                            //     if (file.isFile()) {
                            //         await colibri.Platform.getWorkbench().getContentTypeRegistry().preload(file);
                            //     }
                            // });
                            this.getViewer().setContentProvider(provider);
                            this.getViewer().setScrollY(0);
                        });
                    }
                    createViewer() {
                        return new controls.viewers.TreeViewer(FilesView.ID);
                    }
                    fillContextMenu(menu) {
                        menu.addMenu(this.createNewFileMenu());
                        menu.addMenu(this.createOpenWithMenu());
                        menu.addSeparator();
                        menu.add(new ui.actions.RenameFileAction(this));
                        menu.add(new ui.actions.MoveFilesAction(this));
                        menu.add(new ui.actions.CopyFilesAction(this));
                        menu.add(new ui.actions.DeleteFilesAction(this));
                        menu.add(new ui.actions.UploadFilesAction(this));
                        menu.addSeparator();
                        menu.addExtension(FilesView.MENU_ID);
                    }
                    createOpenWithMenu() {
                        const menu = new controls.Menu("Open With...");
                        const reg = colibri.Platform.getWorkbench().getEditorRegistry();
                        const sel = this.getViewer().getSelection();
                        const file = sel.length === 1 && sel[0] instanceof io.FilePath ? sel[0] : undefined;
                        const factories = [];
                        const defaultFactory = reg.getDefaultFactory();
                        const registeredFactory = file ? reg.getFactoryForInput(file) : undefined;
                        if (registeredFactory && registeredFactory !== defaultFactory) {
                            factories.push(registeredFactory);
                        }
                        if (defaultFactory) {
                            factories.push(defaultFactory);
                        }
                        factories.push(...reg.getFactories().filter(f => f !== defaultFactory && f !== registeredFactory));
                        for (const factory of factories) {
                            menu.addAction({
                                text: factory.getName(),
                                enabled: file !== undefined,
                                callback: () => colibri.Platform.getWorkbench().openEditor(file, factory)
                            });
                            if (factory === defaultFactory) {
                                menu.addSeparator();
                            }
                        }
                        return menu;
                    }
                    createNewFileMenu() {
                        const menu = new controls.Menu("New...");
                        const extensions = colibri.Platform.getExtensionRegistry()
                            .getExtensions(files.ui.dialogs.NewDialogExtension.POINT_ID);
                        for (const ext of extensions) {
                            menu.add(new controls.Action({
                                text: ext.getDialogName(),
                                icon: ext.getDialogIcon(),
                                callback: () => {
                                    const sel = this.getViewer().getSelectionFirstElement();
                                    let loc = sel ? sel : colibri.Platform.getWorkbench().getProjectRoot();
                                    if (loc.isFile()) {
                                        loc = loc.getParent();
                                    }
                                    const dlg = ext.createDialog({
                                        initialFileLocation: loc
                                    });
                                    dlg.setTitle(`New ${ext.getDialogName()}`);
                                }
                            }));
                        }
                        return menu;
                    }
                    getPropertyProvider() {
                        return this._propertyProvider;
                    }
                    createPart() {
                        super.createPart();
                        const wb = ide.Workbench.getWorkbench();
                        const root = wb.getProjectRoot();
                        const viewer = this._viewer;
                        viewer.setStyledLabelProvider(new ui.viewers.StyledFileLabelProvider());
                        viewer.setContentProvider(new ui.viewers.FileTreeContentProvider());
                        viewer.setCellRendererProvider(new ui.viewers.FileCellRendererProvider());
                        viewer.setInput(root);
                        viewer.repaint();
                        viewer.eventOpenItem.addListener(async (file) => {
                            if (file.isFolder()) {
                                viewer.setExpanded(file, !viewer.isExpanded(file));
                                viewer.repaint();
                                return;
                            }
                            files.FilesPlugin.getInstance().getOpenFileAction()(file);
                        });
                        wb.getFileStorage().addChangeListener(change => this.onFileStorageChange(change));
                        wb.eventEditorActivated.addListener(() => {
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
                        return colibri.ColibriPlugin.getInstance().getIcon(colibri.ICON_FOLDER);
                    }
                }
                views.FilesView = FilesView;
                class FilteredContentProvider extends ui.viewers.FileTreeContentProvider {
                    _section;
                    static _cache = new Map();
                    constructor(section) {
                        super();
                        this._section = section;
                    }
                    isFileIncluded(file) {
                        const contentType = colibri.Platform.getWorkbench().getContentTypeRegistry().getCachedContentType(file);
                        const supported = this.isContentTypeSupportedBySection(contentType, this._section);
                        return supported;
                    }
                    isContentTypeSupportedBySection(contentType, section) {
                        const extensions = colibri.Platform.getExtensions(views.ContentTypeSectionExtension.POINT_ID);
                        for (const ext of extensions) {
                            if (ext.isContentTypeSupportedBySection(contentType, section)) {
                                return true;
                            }
                        }
                        return false;
                    }
                    getChildren(parent) {
                        const children = super.getChildren(parent);
                        return children.filter((file) => {
                            if (file.isFolder()) {
                                return this.getChildren(file).length > 0;
                            }
                            return this.isFileIncluded(file);
                        });
                    }
                }
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
                        parent.classList.add("ImagePreviewFormArea");
                        const imgControl = new controls.ImageControl(ide.IMG_SECTION_PADDING);
                        this.getPage().eventControlLayout.addListener(() => {
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
                        return n === 1;
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
                        super("phasereditor2d.files.ui.views.GridImageFileViewer", ...classList);
                        this.setContentProvider(new controls.viewers.ArrayTreeContentProvider());
                        this.setLabelProvider(new ui.viewers.FileLabelProvider());
                        this.setCellRendererProvider(new ui.viewers.FileCellRendererProvider());
                        this.setTreeRenderer(new controls.viewers.GridTreeViewerRenderer(this, false, true)
                            .setPaintItemShadow(true));
                    }
                }
                views.GridImageFileViewer = GridImageFileViewer;
                class ManyImageFileSection extends controls.properties.PropertySection {
                    constructor(page) {
                        super(page, "files.ManyImageFileSection", "Images", true);
                    }
                    createForm(parent) {
                        parent.classList.add("ManyImagePreviewFormArea");
                        const viewer = new GridImageFileViewer();
                        const filteredViewer = new ide.properties.FilteredViewerInPropertySection(this.getPage(), viewer, true);
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
    (function (files) {
        var ui;
        (function (ui) {
            var views;
            (function (views) {
                var controls = colibri.ui.controls;
                var io = colibri.core.io;
                class UploadSection extends controls.properties.PropertySection {
                    constructor(page) {
                        super(page, "phasereditor2d.files.ui.views", "Upload");
                    }
                    createForm(parent) {
                        const comp = this.createGridElement(parent, 1);
                        comp.classList.add("UploadSection");
                        comp.style.display = "grid";
                        comp.style.gridTemplateColumns = "1fr";
                        comp.style.justifySelf = "center";
                        comp.style.gridGap = "5px";
                        this.createButton(comp, "Upload Files To Folder", () => {
                            const dlg = new ui.dialogs.UploadDialog(this.getSelection()[0]);
                            dlg.create();
                        });
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
        })(ui = files.ui || (files.ui = {}));
    })(files = phasereditor2d.files || (phasereditor2d.files = {}));
})(phasereditor2d || (phasereditor2d = {}));
