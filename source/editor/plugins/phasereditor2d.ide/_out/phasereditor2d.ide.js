var phasereditor2d;
(function (phasereditor2d) {
    var ide;
    (function (ide) {
        var controls = colibri.ui.controls;
        class IDEPlugin extends colibri.Plugin {
            eventActivationChanged = new controls.ListenerList();
            static _instance = new IDEPlugin();
            _openingProject;
            _desktopMode;
            _licenseActivated;
            _externalEditorName;
            static getInstance() {
                return this._instance;
            }
            constructor() {
                super("phasereditor2d.ide");
                this._openingProject = false;
                this._licenseActivated = false;
            }
            registerExtensions(reg) {
                // windows
                reg.addExtension(new colibri.ui.ide.WindowExtension(() => new ide.ui.DesignWindow()));
                // keys
                reg.addExtension(new colibri.ui.ide.commands.CommandExtension(ide.ui.actions.IDEActions.registerCommands));
                // themes
                reg.addExtension(new colibri.ui.ide.themes.ThemeExtension({
                    dark: false,
                    id: "lightBlue",
                    classList: ["lightBlue"],
                    displayName: "Light Blue",
                    sceneBackground: controls.Controls.LIGHT_THEME.sceneBackground,
                    viewerForeground: controls.Controls.LIGHT_THEME.viewerForeground,
                    viewerSelectionForeground: controls.Controls.LIGHT_THEME.viewerSelectionForeground,
                    viewerSelectionBackground: controls.Controls.LIGHT_THEME.viewerSelectionBackground,
                }));
                reg.addExtension(new colibri.ui.ide.themes.ThemeExtension({
                    dark: false,
                    id: "lightGray",
                    classList: ["light", "lightGray"],
                    displayName: "Light Gray",
                    sceneBackground: controls.Controls.LIGHT_THEME.sceneBackground,
                    viewerForeground: controls.Controls.LIGHT_THEME.viewerForeground,
                    viewerSelectionForeground: controls.Controls.LIGHT_THEME.viewerSelectionForeground,
                    viewerSelectionBackground: controls.Controls.LIGHT_THEME.viewerSelectionBackground,
                }));
                // files view menu
                if (IDEPlugin.getInstance().isDesktopMode()) {
                    reg.addExtension(new controls.MenuExtension(phasereditor2d.files.ui.views.FilesView.MENU_ID, {
                        command: ide.ui.actions.CMD_LOCATE_FILE
                    }));
                }
                reg.addExtension(new ide.ui.viewers.LibraryFileStyledLabelProviderExtension());
                phasereditor2d.files.FilesPlugin.getInstance().setOpenFileAction(file => this.openFileFromFilesView(file));
                colibri.Platform.getWorkbench().eventEditorActivated.addListener(editor => {
                    if (!editor) {
                        return;
                    }
                    const file = editor.getInput();
                    if (file instanceof colibri.core.io.FilePath) {
                        editor.setReadOnly(ide.core.code.isNodeLibraryFile(file));
                    }
                });
            }
            async compileProject() {
                const exts = colibri.Platform.getExtensions(ide.core.CompileProjectExtension.POINT_ID);
                const dlg = new controls.dialogs.ProgressDialog();
                dlg.create();
                dlg.setTitle("Compiling Project");
                const monitor = new controls.dialogs.ProgressDialogMonitor(dlg);
                for (const ext of exts) {
                    monitor.addTotal(ext.getTotal());
                }
                for (const ext of exts) {
                    await ext.compile(monitor);
                }
                dlg.close();
            }
            async requestServerMode() {
                const data = await colibri.core.io.apiRequest("GetServerMode");
                this._desktopMode = data.desktop === true;
                this._licenseActivated = data.unlocked === true;
                this._externalEditorName = data.externalEditorName || "Alien";
            }
            async requestProjectConfig() {
                const data = await colibri.core.io.apiRequest("GetProjectConfig");
                return data;
            }
            getExternalEditorName() {
                return this._externalEditorName;
            }
            openBrowser(url) {
                console.log("Opening browser for: " + url);
                colibri.Platform.onElectron(electron => {
                    colibri.core.io.apiRequest("OpenBrowser", { url });
                }, () => {
                    controls.Controls.openUrlInNewPage(url);
                });
            }
            async playProject(startScene) {
                const config = await IDEPlugin.getInstance().requestProjectConfig();
                const search = startScene ? `?start=${startScene}` : "";
                let url;
                if (config.playUrl) {
                    url = config.playUrl + search;
                }
                else {
                    if (colibri.Platform.isOnElectron()) {
                        const { protocol, host } = window.location;
                        url = `${protocol}//${host}/editor/external/${search}`;
                    }
                    else {
                        url = `./external/${search}`;
                    }
                }
                this.openBrowser(url);
            }
            async requestUpdateAvailable() {
                if (this.isDesktopMode()) {
                    if (await this.isNewUpdateAvailable()) {
                        colibri.Platform.getWorkbench().showNotification("A new version is available!", () => this.openBrowser("https://phasereditor2d.com/downloads"));
                    }
                }
            }
            async isNewUpdateAvailable() {
                const data = await colibri.core.io.apiRequest("GetNewVersionAvailable");
                return data.available;
            }
            isLicenseActivated() {
                return this._licenseActivated;
            }
            isDesktopMode() {
                return this._desktopMode;
            }
            createHelpMenuItem(menu, helpPath) {
                menu.addAction({
                    text: "Help",
                    callback: () => {
                        controls.Controls.openUrlInNewPage("https://help.phasereditor2d.com/v3/" + helpPath);
                    }
                });
            }
            async ideOpenProject() {
                this._openingProject = true;
                controls.dialogs.Dialog.closeAllDialogs();
                const dlg = new ide.ui.dialogs.OpeningProjectDialog();
                dlg.create();
                dlg.setTitle("Opening project");
                dlg.setProgress(0);
                const monitor = new controls.dialogs.ProgressDialogMonitor(dlg);
                try {
                    const wb = colibri.Platform.getWorkbench();
                    {
                        const win = wb.getActiveWindow();
                        if (win instanceof ide.ui.DesignWindow) {
                            win.saveState(wb.getProjectPreferences());
                        }
                    }
                    console.log(`IDEPlugin: opening project`);
                    document.title = `Phaser Editor 2D v${colibri.PRODUCT_VERSION} ${this.isLicenseActivated() ? "Premium" : "Free"}`;
                    const designWindow = wb.activateWindow(ide.ui.DesignWindow.ID);
                    const editorArea = designWindow.getEditorArea();
                    editorArea.closeAllEditors();
                    await wb.openProject(monitor);
                    dlg.setProgress(1);
                    if (designWindow) {
                        designWindow.restoreState(wb.getProjectPreferences());
                    }
                    const projectName = wb.getFileStorage().getRoot().getName();
                    document.title = `Phaser Editor 2D v${colibri.PRODUCT_VERSION} ${this.isLicenseActivated() ? "Premium" : "Free"} ${projectName}`;
                }
                finally {
                    this._openingProject = false;
                    dlg.close();
                }
            }
            isOpeningProject() {
                return this._openingProject;
            }
            openProjectInVSCode() {
                this.openFileExternalEditor(colibri.ui.ide.FileUtils.getRoot());
            }
            setEnableOpenCodeFileInExternalEditor(enabled) {
                window.localStorage.setItem("phasereditor2d.ide.enableOpenCodeFileInExternalEditor", enabled ? "1" : "0");
            }
            isEnableOpenCodeFileInExternalEditor() {
                return window.localStorage.getItem("phasereditor2d.ide.enableOpenCodeFileInExternalEditor") === "1";
            }
            openFileFromFilesView(file) {
                // a hack, detect if content type is JS, TS, or plain text, so it opens the external editor
                if (this.isEnableOpenCodeFileInExternalEditor()) {
                    const ct = colibri.Platform.getWorkbench().getContentTypeRegistry().getCachedContentType(file);
                    switch (ct) {
                        case "typescript":
                        case "javascript":
                        case "html":
                        case "css":
                            console.log(`Openin ${file.getFullName()} with external editor`);
                            this.openFileExternalEditor(file);
                            return;
                    }
                }
                colibri.Platform.getWorkbench().openEditor(file);
            }
            async openFileExternalEditor(file) {
                const resp = await colibri.core.io.apiRequest("OpenVSCode", { location: file.getFullName() });
                if (resp.error) {
                    alert(resp.error);
                }
            }
        }
        ide.IDEPlugin = IDEPlugin;
        colibri.Platform.addPlugin(IDEPlugin.getInstance());
        /* program entry point */
        async function main() {
            await colibri.Platform.loadProduct();
            console.log(`%c %c Phaser Editor 2D %c v${colibri.PRODUCT_VERSION} %c %c https://phasereditor2d.com `, "background-color:red", "background-color:#3f3f3f;color:whitesmoke", "background-color:orange;color:black", "background-color:red", "background-color:silver");
            colibri.ui.controls.dialogs.AlertDialog.replaceConsoleAlert();
            await IDEPlugin.getInstance().requestServerMode();
            await colibri.Platform.start();
            await IDEPlugin.getInstance().ideOpenProject();
            await IDEPlugin.getInstance().requestUpdateAvailable();
        }
        window.addEventListener("load", main);
    })(ide = phasereditor2d.ide || (phasereditor2d.ide = {}));
})(phasereditor2d || (phasereditor2d = {}));
var phasereditor2d;
(function (phasereditor2d) {
    var ide;
    (function (ide) {
        var core;
        (function (core) {
            class CompileProjectExtension extends colibri.Extension {
                static POINT_ID = "phasereditor2d.ide.core.CompilerExtension";
                constructor() {
                    super(CompileProjectExtension.POINT_ID);
                }
            }
            core.CompileProjectExtension = CompileProjectExtension;
        })(core = ide.core || (ide.core = {}));
    })(ide = phasereditor2d.ide || (phasereditor2d.ide = {}));
})(phasereditor2d || (phasereditor2d = {}));
var phasereditor2d;
(function (phasereditor2d) {
    var ide;
    (function (ide) {
        var core;
        (function (core) {
            class MultiHashBuilder {
                _tokens;
                constructor() {
                    this._tokens = new Set();
                }
                addPartialToken(token) {
                    if (token && token !== "") {
                        this._tokens.add(token);
                    }
                }
                addPartialFileToken(file) {
                    if (file) {
                        this.addPartialToken("file(" + file.getFullName() + "," + file.getModTime() + ")");
                    }
                }
                build() {
                    const list = [];
                    for (const token of this._tokens) {
                        list.push(token);
                    }
                    return list.sort().join("+");
                }
            }
            core.MultiHashBuilder = MultiHashBuilder;
        })(core = ide.core || (ide.core = {}));
    })(ide = phasereditor2d.ide || (phasereditor2d.ide = {}));
})(phasereditor2d || (phasereditor2d = {}));
var phasereditor2d;
(function (phasereditor2d) {
    var ide;
    (function (ide) {
        var core;
        (function (core) {
            class PhaserDocs {
                _data = {};
                constructor(plugin, ...resKeys) {
                    for (const resKey of resKeys) {
                        const resData = plugin.getResources().getResData(resKey);
                        const converter = new showdown.Converter();
                        for (const k of Object.keys(resData)) {
                            const help = resData[k];
                            const html = converter.makeHtml(help);
                            this._data[k] = html;
                        }
                    }
                }
                static markdownToHtml(txt) {
                    const converter = new showdown.Converter();
                    return converter.makeHtml(txt);
                }
                getDoc(helpKey, wrap = true) {
                    if (helpKey in this._data) {
                        if (wrap) {
                            return `<small>${helpKey}</small> <br><br> <div style="max-width:60em">${this._data[helpKey]}</div>`;
                        }
                        return this._data[helpKey];
                    }
                    return "Help not found for: " + helpKey;
                }
                getKeys() {
                    return Object.keys(this._data);
                }
            }
            core.PhaserDocs = PhaserDocs;
        })(core = ide.core || (ide.core = {}));
    })(ide = phasereditor2d.ide || (phasereditor2d.ide = {}));
})(phasereditor2d || (phasereditor2d = {}));
var phasereditor2d;
(function (phasereditor2d) {
    var ide;
    (function (ide) {
        var core;
        (function (core) {
            var code;
            (function (code) {
                class BaseCodeGenerator {
                    _text;
                    _replace;
                    _indent;
                    constructor() {
                        this._text = "";
                        this._indent = 0;
                    }
                    formatVariableName(name) {
                        return code.formatToValidVarName(name);
                    }
                    getOffset() {
                        return this._text.length;
                    }
                    generate(replace) {
                        this._replace = replace ?? "";
                        this.internalGenerate();
                        this.cleanCode();
                        return this._text;
                    }
                    cleanCode() {
                        // clean the empty lines
                        const lines = this._text.split("\n").map(line => {
                            if (line.trim() === "") {
                                return "";
                            }
                            return line;
                        });
                        this._text = lines.join("\n");
                    }
                    length() {
                        return this._text.length;
                    }
                    getStartSectionContent(endTag, defaultContent) {
                        const j = this._replace.indexOf(endTag);
                        const size = this._replace.length;
                        if (size > 0 && j !== -1) {
                            const section = this._replace.substring(0, j);
                            return section;
                        }
                        return defaultContent;
                    }
                    getSectionContent(openTag, closeTag, defaultContent) {
                        const i = this._replace.indexOf(openTag);
                        let j = this._replace.indexOf(closeTag);
                        if (j === -1) {
                            j = this._replace.length;
                        }
                        if (i !== -1 && j !== -1) {
                            const section = this._replace.substring(i + openTag.length, j);
                            return section;
                        }
                        return defaultContent;
                    }
                    getReplaceContent() {
                        return this._replace;
                    }
                    userCode(text) {
                        const lines = text.split("\n");
                        for (const line of lines) {
                            this.line(line);
                        }
                    }
                    sectionStart(endTag, defaultContent) {
                        this.append(this.getStartSectionContent(endTag, defaultContent));
                        this.append(endTag);
                    }
                    sectionEnd(openTag, defaultContent) {
                        this.append(openTag);
                        this.append(this.getSectionContent(openTag, "papa(--o^^o--)pig", defaultContent));
                    }
                    section(openTag, closeTag, defaultContent) {
                        const content = this.getSectionContent(openTag, closeTag, defaultContent);
                        this.append(openTag);
                        this.append(content);
                        this.append(closeTag);
                    }
                    cut(start, end) {
                        const str = this._text.substring(start, end);
                        const s1 = this._text.slice(0, start);
                        const s2 = this._text.slice(end, this._text.length);
                        this._text = s1 + s2;
                        // _sb.delete(start, end);
                        return str;
                    }
                    trim(run) {
                        const a = this.length();
                        run();
                        const b = this.length();
                        const str = this._text.substring(a, b);
                        if (str.trim().length === 0) {
                            this.cut(a, b);
                        }
                    }
                    append(str) {
                        this._text += str;
                    }
                    join(list) {
                        for (let i = 0; i < list.length; i++) {
                            if (i > 0) {
                                this.append(", ");
                            }
                            this.append(list[i]);
                        }
                    }
                    line(line = "") {
                        this.append(line);
                        this.append("\n");
                        this.append(this.getIndentTabs());
                    }
                    lineIfNeeded() {
                        if (!this.lastIsEmptyLine()) {
                            this.line();
                        }
                    }
                    lastIsEmptyLine() {
                        let i = this._text.length - 1;
                        let n = 0;
                        while (i > 0) {
                            const c = this._text[i];
                            if (c === "\n") {
                                n++;
                            }
                            if (c.trim().length > 0) {
                                break;
                            }
                            i--;
                        }
                        return n > 1;
                    }
                    static escapeStringLiterals(str) {
                        return str.replace("\\", "\\\\").replace("\\R", "\n").replace("'", "\\'").replace("\"", "\\\"");
                    }
                    openIndent(line = "") {
                        this._indent++;
                        this.line(line);
                    }
                    closeIndent(str = "") {
                        this._indent--;
                        const i = this._text.lastIndexOf("\n");
                        if (i >= 0) {
                            const last = this._text.substring(i);
                            if (last.trim() === "") {
                                // removes the extra blank line
                                this._text = this._text.substring(0, i);
                            }
                        }
                        this.line();
                        this.line(str);
                    }
                    getIndentTabs() {
                        return "\t".repeat(this._indent);
                    }
                    static emptyStringToNull(str) {
                        return str == null ? null : (str.trim().length === 0 ? null : str);
                    }
                }
                code.BaseCodeGenerator = BaseCodeGenerator;
            })(code = core.code || (core.code = {}));
        })(core = ide.core || (ide.core = {}));
    })(ide = phasereditor2d.ide || (phasereditor2d.ide = {}));
})(phasereditor2d || (phasereditor2d = {}));
var phasereditor2d;
(function (phasereditor2d) {
    var ide;
    (function (ide) {
        var core;
        (function (core) {
            var code;
            (function (code) {
                var io = colibri.core.io;
                function isCopiedLibraryFile(file) {
                    if (file.isRoot()) {
                        return false;
                    }
                    const name = "library.txt";
                    if (file.isFolder()) {
                        if (file.getFile(name)) {
                            return true;
                        }
                    }
                    else if (file.getName() === name || file.getSibling(name)) {
                        return true;
                    }
                    return isCopiedLibraryFile(file.getParent());
                }
                code.isCopiedLibraryFile = isCopiedLibraryFile;
                function isNodeLibraryFile(file) {
                    if (file.isFolder() && file.getName() === "node_modules") {
                        return true;
                    }
                    if (file.isRoot()) {
                        return false;
                    }
                    return isNodeLibraryFile(file.getParent());
                }
                code.isNodeLibraryFile = isNodeLibraryFile;
                function findNodeModuleName(file) {
                    if (file.isRoot() || file.getParent().isRoot()) {
                        return null;
                    }
                    const parentName = file.getParent().getName();
                    const fileName = file.getName();
                    // try case node_modules/<current-files>
                    if (parentName === "node_modules") {
                        return fileName;
                    }
                    const parentParentName = file.getParent().getParent().getName();
                    // try case node_modules/@org/<current-file>
                    if (parentName.startsWith("@") && parentParentName === "node_modules") {
                        return parentName + "/" + fileName;
                    }
                    return findNodeModuleName(file.getParent());
                }
                code.findNodeModuleName = findNodeModuleName;
                function getImportPath(file, importFile) {
                    const nodeModule = findNodeModuleName(importFile);
                    if (nodeModule) {
                        return { importPath: nodeModule, asDefault: false };
                    }
                    const parent = file.getParent();
                    const parentPath = parent.getFullName();
                    const parentElements = parentPath.split("/");
                    const importFilePath = io.FilePath.join(importFile.getParent().getFullName(), importFile.getNameWithoutExtension());
                    const importFileElements = importFilePath.split("/");
                    if (parent === importFile.getParent()) {
                        return { importPath: "./" + importFile.getNameWithoutExtension(), asDefault: true };
                    }
                    if (importFilePath.startsWith(parentPath + "/")) {
                        return {
                            importPath: "./" + importFileElements.slice(parentElements.length).join("/"),
                            asDefault: true
                        };
                    }
                    while (parentElements.length > 0) {
                        const parentFirst = parentElements.shift();
                        const importFileFirst = importFileElements.shift();
                        if (parentFirst !== importFileFirst) {
                            importFileElements.unshift(importFileFirst);
                            return {
                                importPath: "../".repeat(parentElements.length + 1) + importFileElements.join("/"),
                                asDefault: true
                            };
                        }
                    }
                    return { importPath: "", asDefault: true };
                }
                code.getImportPath = getImportPath;
                function isAlphaNumeric(c) {
                    const n = c.charCodeAt(0);
                    return (n > 47 && n < 58) // 0-9
                        || (n > 64 && n < 91) // a-z
                        || (n > 96 && n < 123); // A-Z
                }
                const validCharsMap = new Map();
                function isValidChar(c) {
                    if (validCharsMap.has(c)) {
                        return validCharsMap.get(c);
                    }
                    let result = true;
                    try {
                        // tslint:disable
                        eval("() => {  function pe" + c + "pe() {} }");
                    }
                    catch (e) {
                        result = false;
                        return false;
                    }
                    validCharsMap.set(c, result);
                    return result;
                }
                function formatToValidVarName(name) {
                    let s = "";
                    for (const c of name) {
                        // TODO: use isValidChar, but first we have to ask to the user if he wants to do it.
                        if (isAlphaNumeric(c)) {
                            s += (s.length === 0 ? c.toLowerCase() : c);
                        }
                        else {
                            s += "_";
                        }
                    }
                    return s;
                }
                code.formatToValidVarName = formatToValidVarName;
            })(code = core.code || (core.code = {}));
        })(core = ide.core || (ide.core = {}));
    })(ide = phasereditor2d.ide || (phasereditor2d.ide = {}));
})(phasereditor2d || (phasereditor2d = {}));
var phasereditor2d;
(function (phasereditor2d) {
    var ide;
    (function (ide) {
        var core;
        (function (core) {
            var code;
            (function (code) {
                let SourceLang;
                (function (SourceLang) {
                    SourceLang["JAVA_SCRIPT"] = "JAVA_SCRIPT";
                    SourceLang["TYPE_SCRIPT"] = "TYPE_SCRIPT";
                })(SourceLang = code.SourceLang || (code.SourceLang = {}));
            })(code = core.code || (core.code = {}));
        })(core = ide.core || (ide.core = {}));
    })(ide = phasereditor2d.ide || (phasereditor2d.ide = {}));
})(phasereditor2d || (phasereditor2d = {}));
var phasereditor2d;
(function (phasereditor2d) {
    var ide;
    (function (ide_1) {
        var ui;
        (function (ui) {
            var controls = colibri.ui.controls;
            var ide = colibri.ui.ide;
            class DesignWindow extends ide.WorkbenchWindow {
                static ID = "phasereditor2d.ide.ui.DesignWindow";
                static MENU_MAIN_START = "phasereditor2d.ide.ui.MainMenu.start";
                static MENU_MAIN_END = "phasereditor2d.ide.ui.MainMenu.end";
                _outlineView;
                _filesView;
                _inspectorView;
                _blocksView;
                _editorArea;
                _split_Files_Blocks;
                _split_Editor_FilesBlocks;
                _split_Outline_EditorFilesBlocks;
                _split_OutlineEditorFilesBlocks_Inspector;
                constructor() {
                    super(DesignWindow.ID);
                    ide.Workbench.getWorkbench().eventPartActivated.addListener(() => {
                        this.saveWindowState();
                    });
                    window.addEventListener("beforeunload", e => {
                        this.saveWindowState();
                    });
                }
                saveWindowState() {
                    if (ide_1.IDEPlugin.getInstance().isOpeningProject()) {
                        return;
                    }
                    this.saveState(colibri.Platform.getWorkbench().getProjectPreferences());
                }
                saveState(prefs) {
                    this.saveEditorsState(prefs);
                }
                restoreState(prefs) {
                    console.log("DesignWindow.restoreState");
                    this.restoreEditors(prefs);
                }
                createParts() {
                    this._outlineView = new phasereditor2d.outline.ui.views.OutlineView();
                    this._filesView = new phasereditor2d.files.ui.views.FilesView();
                    this._inspectorView = new colibri.inspector.ui.views.InspectorView();
                    this._blocksView = new phasereditor2d.blocks.ui.views.BlocksView();
                    this._editorArea = new ide.EditorArea();
                    this._split_Files_Blocks = new controls.SplitPanel(this.createViewFolder(this._filesView), this.createViewFolder(this._blocksView));
                    this._split_Editor_FilesBlocks = new controls.SplitPanel(this._editorArea, this._split_Files_Blocks, false);
                    this._split_Outline_EditorFilesBlocks = new controls.SplitPanel(this.createViewFolder(this._outlineView), this._split_Editor_FilesBlocks);
                    this._split_OutlineEditorFilesBlocks_Inspector = new controls.SplitPanel(this._split_Outline_EditorFilesBlocks, this.createViewFolder(this._inspectorView));
                    this.getClientArea().add(this._split_OutlineEditorFilesBlocks_Inspector);
                    this.initToolbar();
                    this.initialLayout();
                }
                initToolbar() {
                    const toolbar = this.getToolbar();
                    {
                        // left area
                        const area = toolbar.getLeftArea();
                        const manager = new controls.ToolbarManager(area);
                        manager.add(new phasereditor2d.files.ui.actions.OpenNewFileDialogAction());
                        {
                            const openDialog = colibri.Platform
                                .getProductOption("phasereditor2d.ide.playButton") === "open-dialog";
                            const id = openDialog ?
                                ui.actions.CMD_QUICK_PLAY_PROJECT : ui.actions.CMD_PLAY_PROJECT;
                            manager.addCommand(id, { showText: false });
                        }
                    }
                    {
                        // right area
                        const area = toolbar.getRightArea();
                        const manager = new controls.ToolbarManager(area);
                        manager.add(new ui.actions.OpenMainMenuAction());
                    }
                }
                getEditorArea() {
                    return this._editorArea;
                }
                initialLayout() {
                    this._split_Files_Blocks.setSplitFactor(0.3);
                    this._split_Editor_FilesBlocks.setSplitFactor(0.6);
                    this._split_Outline_EditorFilesBlocks.setSplitFactor(0.15);
                    this._split_OutlineEditorFilesBlocks_Inspector.setSplitFactor(0.8);
                    this.layout();
                }
            }
            ui.DesignWindow = DesignWindow;
        })(ui = ide_1.ui || (ide_1.ui = {}));
    })(ide = phasereditor2d.ide || (phasereditor2d.ide = {}));
})(phasereditor2d || (phasereditor2d = {}));
var phasereditor2d;
(function (phasereditor2d) {
    var ide;
    (function (ide) {
        var ui;
        (function (ui) {
            var actions;
            (function (actions) {
                actions.CAT_PROJECT = "phasereditor2d.ide.ui.actions.ProjectCategory";
                actions.CMD_LOCATE_FILE = "phasereditor2d.ide.ui.actions.LocateFile";
                actions.CMD_RELOAD_PROJECT = "phasereditor2d.ide.ui.actions.ReloadProjectAction";
                actions.CMD_COMPILE_PROJECT = "phasereditor2d.ide.ui.actions.CompileProject";
                actions.CMD_PLAY_PROJECT = "phasereditor2d.ide.ui.actions.PlayProject";
                actions.CMD_QUICK_PLAY_PROJECT = "phasereditor2d.ide.ui.actions.QuickPlayProject";
                actions.CMD_OPEN_VSCODE = "phasereditor2d.ide.ui.actions.OpenVSCode";
                actions.CMD_ENABLE_OPEN_SOURCE_FILE_IN_EXTERNAL_EDITOR = "phasereditor2d.ide.ui.actions.EnableOpenCodeFileInExternalEditor";
                actions.CMD_DISABLE_OPEN_SOURCE_FILE_IN_EXTERNAL_EDITOR = "phasereditor2d.ide.ui.actions.EnableOpenCodeFileInExternalEditor";
                // TODO: Remove
                function isNotWelcomeWindowScope(args) {
                    return true;
                }
                actions.isNotWelcomeWindowScope = isNotWelcomeWindowScope;
                class IDEActions {
                    static registerCommands(manager) {
                        manager.addCategory({
                            id: actions.CAT_PROJECT,
                            name: "Project"
                        });
                        manager.add({
                            command: {
                                id: actions.CMD_ENABLE_OPEN_SOURCE_FILE_IN_EXTERNAL_EDITOR,
                                category: actions.CAT_PROJECT,
                                name: "Enable Open Code File In External Editor",
                                tooltip: "If enable, clicking on a coding file in the Files view opens the external editor"
                            },
                            handler: {
                                testFunc: isNotWelcomeWindowScope,
                                executeFunc: () => {
                                    ide.IDEPlugin.getInstance().setEnableOpenCodeFileInExternalEditor(true);
                                }
                            }
                        });
                        manager.add({
                            command: {
                                id: actions.CMD_DISABLE_OPEN_SOURCE_FILE_IN_EXTERNAL_EDITOR,
                                category: actions.CAT_PROJECT,
                                name: "Disable Open Code File In External Editor",
                                tooltip: "If disabled, clicking on a coding file open the built-in editor."
                            },
                            handler: {
                                testFunc: isNotWelcomeWindowScope,
                                executeFunc: () => {
                                    ide.IDEPlugin.getInstance().setEnableOpenCodeFileInExternalEditor(false);
                                }
                            }
                        });
                        // play game
                        manager.add({
                            command: {
                                id: actions.CMD_PLAY_PROJECT,
                                name: "Play Project",
                                tooltip: "Run this project in the browser.",
                                icon: phasereditor2d.resources.getIcon(phasereditor2d.resources.ICON_PLAY),
                                category: actions.CAT_PROJECT
                            },
                            handler: {
                                testFunc: isNotWelcomeWindowScope,
                                executeFunc: async (args) => {
                                    await colibri.Platform.getWorkbench().saveAllEditors();
                                    ide.IDEPlugin.getInstance().playProject();
                                }
                            },
                            keys: {
                                key: "F12"
                            }
                        });
                        manager.add({
                            command: {
                                id: actions.CMD_QUICK_PLAY_PROJECT,
                                name: "Quick Play Project",
                                tooltip: "Run this project in a dialog.",
                                icon: phasereditor2d.resources.getIcon(phasereditor2d.resources.ICON_PLAY),
                                category: actions.CAT_PROJECT
                            },
                            handler: {
                                testFunc: isNotWelcomeWindowScope,
                                executeFunc: async (args) => {
                                    await colibri.Platform.getWorkbench().saveAllEditors();
                                    const config = await ide.IDEPlugin.getInstance().requestProjectConfig();
                                    let url;
                                    if (colibri.Platform.isOnElectron()) {
                                        url = config.playUrl || colibri.ui.ide.FileUtils.getRoot().getExternalUrl();
                                    }
                                    else {
                                        url = config.playUrl || "./external/";
                                    }
                                    const dlg = new ui.dialogs.PlayDialog(url);
                                    dlg.create();
                                }
                            },
                            keys: {
                                key: "F10"
                            }
                        });
                        // reload project
                        manager.add({
                            command: {
                                id: actions.CMD_RELOAD_PROJECT,
                                name: "Reload Project",
                                tooltip: "Reload the project files.",
                                category: actions.CAT_PROJECT
                            },
                            handler: {
                                testFunc: isNotWelcomeWindowScope,
                                executeFunc: args => ide.IDEPlugin.getInstance().ideOpenProject()
                            },
                            keys: {
                                control: true,
                                alt: true,
                                key: "KeyR"
                            }
                        });
                        // compile project
                        manager.add({
                            command: {
                                id: actions.CMD_COMPILE_PROJECT,
                                name: "Compile Project",
                                tooltip: "Compile all files.",
                                category: actions.CAT_PROJECT
                            },
                            handler: {
                                testFunc: isNotWelcomeWindowScope,
                                executeFunc: args => ide.IDEPlugin.getInstance().compileProject()
                            },
                            keys: {
                                control: true,
                                alt: true,
                                key: "KeyB"
                            }
                        });
                        if (ide.IDEPlugin.getInstance().isDesktopMode()) {
                            // locate file
                            manager.add({
                                command: {
                                    id: actions.CMD_LOCATE_FILE,
                                    category: actions.CAT_PROJECT,
                                    name: "Locate File",
                                    tooltip: "Open the selected file (or project root) in the OS file manager."
                                },
                                keys: {
                                    key: "KeyL",
                                    control: true,
                                    alt: true
                                },
                                handler: {
                                    executeFunc: async (args) => {
                                        let file = colibri.ui.ide.FileUtils.getRoot();
                                        const view = args.activePart;
                                        if (view instanceof phasereditor2d.files.ui.views.FilesView) {
                                            const sel = view.getSelection()[0];
                                            if (sel) {
                                                file = sel;
                                            }
                                        }
                                        if (!file) {
                                            return;
                                        }
                                        if (file.isFile()) {
                                            file = file.getParent();
                                        }
                                        const resp = await colibri.core.io.apiRequest("OpenFileManager", { file: file.getFullName() });
                                        if (resp.error) {
                                            alert(resp.error);
                                        }
                                    }
                                }
                            });
                            // open vscode
                            manager.add({
                                command: {
                                    id: actions.CMD_OPEN_VSCODE,
                                    category: actions.CAT_PROJECT,
                                    name: "Open " + ide.IDEPlugin.getInstance().getExternalEditorName(),
                                    tooltip: "Open the project in the configured external editor (" + ide.IDEPlugin.getInstance().getExternalEditorName() + ")."
                                },
                                keys: {
                                    control: true,
                                    alt: true,
                                    key: "KeyU"
                                },
                                handler: {
                                    executeFunc: args => ide.IDEPlugin.getInstance().openProjectInVSCode()
                                }
                            });
                        }
                    }
                }
                actions.IDEActions = IDEActions;
            })(actions = ui.actions || (ui.actions = {}));
        })(ui = ide.ui || (ide.ui = {}));
    })(ide = phasereditor2d.ide || (phasereditor2d.ide = {}));
})(phasereditor2d || (phasereditor2d = {}));
var phasereditor2d;
(function (phasereditor2d) {
    var ide;
    (function (ide) {
        var ui;
        (function (ui) {
            var actions;
            (function (actions) {
                var controls = colibri.ui.controls;
                class OpenMainMenuAction extends controls.Action {
                    constructor() {
                        super({
                            text: "Open Menu",
                            tooltip: "Main menu",
                            showText: false,
                            icon: colibri.ColibriPlugin.getInstance().getIcon(colibri.ICON_MENU)
                        });
                    }
                    run(e) {
                        const menu = new controls.Menu();
                        menu.addExtension(ui.DesignWindow.MENU_MAIN_START);
                        menu.addCommand(actions.CMD_RELOAD_PROJECT);
                        menu.addCommand(actions.CMD_COMPILE_PROJECT);
                        if (ide.IDEPlugin.getInstance().isDesktopMode()) {
                            menu.addSeparator();
                            menu.addCommand(actions.CMD_OPEN_VSCODE);
                        }
                        menu.addSeparator();
                        menu.addCommand(colibri.ui.ide.actions.CMD_CHANGE_THEME);
                        menu.addCommand(colibri.ui.ide.actions.CMD_SHOW_COMMAND_PALETTE);
                        menu.addExtension(ui.DesignWindow.MENU_MAIN_END);
                        menu.addSeparator();
                        if (ide.IDEPlugin.getInstance().isDesktopMode()) {
                            const activated = ide.IDEPlugin.getInstance().isLicenseActivated();
                            menu.add(new controls.Action({
                                text: activated ? "Change License Key" : "Unlock Phaser Editor 2D",
                                callback: () => {
                                    new ui.dialogs.UnlockDialog().create();
                                }
                            }));
                            menu.add(new controls.Action({
                                text: "Check For Updates",
                                callback: async () => {
                                    const dlg = new controls.dialogs.AlertDialog();
                                    dlg.create();
                                    dlg.setTitle("Updates");
                                    dlg.setMessage("Checking for updates...");
                                    const available = await ide.IDEPlugin.getInstance().isNewUpdateAvailable();
                                    dlg.setMessage(available ? "A new version is available!" : "Updates not found.");
                                }
                            }));
                        }
                        menu.add(new controls.Action({
                            text: "Unofficial Phaser Help Center",
                            callback: () => controls.Controls.openUrlInNewPage("https://helpcenter.phasereditor2d.com")
                        }));
                        menu.add(new controls.Action({
                            text: "Help",
                            callback: () => controls.Controls.openUrlInNewPage("https://help.phasereditor2d.com")
                        }));
                        menu.add(new controls.Action({
                            text: "About",
                            callback: () => {
                                new ui.dialogs.AboutDialog().create();
                            }
                        }));
                        menu.createWithEvent(e);
                    }
                }
                actions.OpenMainMenuAction = OpenMainMenuAction;
            })(actions = ui.actions || (ui.actions = {}));
        })(ui = ide.ui || (ide.ui = {}));
    })(ide = phasereditor2d.ide || (phasereditor2d.ide = {}));
})(phasereditor2d || (phasereditor2d = {}));
var phasereditor2d;
(function (phasereditor2d) {
    var ide;
    (function (ide) {
        var ui;
        (function (ui) {
            var dialogs;
            (function (dialogs) {
                var controls = colibri.ui.controls;
                class AboutDialog extends controls.dialogs.Dialog {
                    constructor() {
                        super("AboutDialog");
                    }
                    createDialogArea() {
                        const activated = ide.IDEPlugin.getInstance().isLicenseActivated();
                        const element = document.createElement("div");
                        element.classList.add("DialogClientArea", "DialogSection");
                        const html = `
            <p class="Title"><b>Phaser Editor 2D ${activated ? "Premium" : "Free"}</b><br><small>v${colibri.PRODUCT_VERSION}</small></p>
            <p><i>A friendly IDE for HTML5 game development</i></p>

            <p>
                <p>@PhaserEditor2D</p>
                <a href="https://phasereditor2d.com" rel="noopener" target="_blank">phasereditor2d.com</a>
                <a href="https://www.twitter.com/PhaserEditor2D" rel="noopener" target="_blank">Twitter</a>
                <a href="https://www.facebook.com/PhaserEditor2D" rel="noopener" target="_blank">Facebook</a>
                <a href="https://github.com/PhaserEditor2D/PhaserEditor" rel="noopener" target="_blank">GitHub</a>
                <a href="https://www.youtube.com/c/PhaserEditor2D" rel="noopener" target="_blank">YouTube</a> <br>
            </p>

            <p>
            </p>

            <p><small>Copyright &copy; Arian Fornaris </small></p>
            `;
                        element.innerHTML = html;
                        this.getElement().appendChild(element);
                    }
                    create() {
                        super.create();
                        this.setTitle("About");
                        this.addButton("Close", () => this.close());
                    }
                }
                dialogs.AboutDialog = AboutDialog;
            })(dialogs = ui.dialogs || (ui.dialogs = {}));
        })(ui = ide.ui || (ide.ui = {}));
    })(ide = phasereditor2d.ide || (phasereditor2d.ide = {}));
})(phasereditor2d || (phasereditor2d = {}));
var phasereditor2d;
(function (phasereditor2d) {
    var ide;
    (function (ide) {
        var ui;
        (function (ui) {
            var dialogs;
            (function (dialogs) {
                var controls = colibri.ui.controls;
                class OpeningProjectDialog extends controls.dialogs.ProgressDialog {
                    create() {
                        super.create();
                        this.getDialogBackgroundElement().classList.add("DarkDialogContainer");
                    }
                }
                dialogs.OpeningProjectDialog = OpeningProjectDialog;
            })(dialogs = ui.dialogs || (ui.dialogs = {}));
        })(ui = ide.ui || (ide.ui = {}));
    })(ide = phasereditor2d.ide || (phasereditor2d.ide = {}));
})(phasereditor2d || (phasereditor2d = {}));
var phasereditor2d;
(function (phasereditor2d) {
    var ide;
    (function (ide) {
        var ui;
        (function (ui) {
            var dialogs;
            (function (dialogs) {
                var controls = colibri.ui.controls;
                class PlayDialog extends controls.dialogs.Dialog {
                    _url;
                    constructor(url) {
                        super("PlayDialog");
                        this._url = url;
                    }
                    resize() {
                        const height = Math.floor(window.innerHeight * 0.95);
                        let width = Math.floor(Math.min(height * 1920 / 1080, window.innerWidth * 0.95));
                        this.setBounds({
                            x: window.innerWidth / 2 - width / 2,
                            y: 10,
                            width: width,
                            height: height
                        });
                    }
                    createDialogArea() {
                        const frameElement = document.createElement("iframe");
                        frameElement.classList.add("DialogClientArea");
                        frameElement.src = this._url;
                        frameElement.addEventListener("load", e => {
                            frameElement.contentDocument.addEventListener("keydown", e2 => {
                                if (e2.key === "Escape") {
                                    this.close();
                                }
                            });
                        });
                        this.getElement().appendChild(frameElement);
                    }
                    create() {
                        super.create();
                        this.setTitle("Play");
                        this.addCancelButton();
                        this.addButton("Open In New Tab", () => {
                            colibri.Platform.getWorkbench()
                                .getCommandManager()
                                .executeCommand(ui.actions.CMD_PLAY_PROJECT);
                        });
                    }
                }
                dialogs.PlayDialog = PlayDialog;
            })(dialogs = ui.dialogs || (ui.dialogs = {}));
        })(ui = ide.ui || (ide.ui = {}));
    })(ide = phasereditor2d.ide || (phasereditor2d.ide = {}));
})(phasereditor2d || (phasereditor2d = {}));
var phasereditor2d;
(function (phasereditor2d) {
    var ide;
    (function (ide) {
        var ui;
        (function (ui) {
            var dialogs;
            (function (dialogs) {
                var controls = colibri.ui.controls;
                class UnlockDialog extends controls.dialogs.InputDialog {
                    create() {
                        super.create();
                        this.setTitle("Unlock Phaser Editor 2D");
                        this.setMessage("Enter the License Key");
                        const btn = this.addButton("Get License Key", () => {
                            controls.Controls.openUrlInNewPage("https://gumroad.com/l/phasereditor");
                        });
                        btn.style.float = "left";
                        this.getAcceptButton().innerText = "Unlock";
                        this.setInputValidator(text => text.trim().length > 0);
                        this.validate();
                        this.setResultCallback(async (value) => {
                            const data = await colibri.core.io.apiRequest("UnlockEditor", {
                                lickey: value
                            });
                            if (data.error) {
                                alert("Error: " + data.error);
                            }
                            else {
                                alert(data.message);
                                if (data.activated) {
                                    setTimeout(() => {
                                        if (confirm("A page refresh is required. Do you want to refresh it now?")) {
                                            window.location.reload();
                                        }
                                    }, 3000);
                                }
                            }
                        });
                    }
                }
                dialogs.UnlockDialog = UnlockDialog;
            })(dialogs = ui.dialogs || (ui.dialogs = {}));
        })(ui = ide.ui || (ide.ui = {}));
    })(ide = phasereditor2d.ide || (phasereditor2d.ide = {}));
})(phasereditor2d || (phasereditor2d = {}));
var phasereditor2d;
(function (phasereditor2d) {
    var ide;
    (function (ide) {
        var ui;
        (function (ui) {
            var viewers;
            (function (viewers) {
                var controls = colibri.ui.controls;
                class LibraryFileStyledLabelProviderExtension extends colibri.Extension {
                    constructor() {
                        super(phasereditor2d.files.ui.viewers.StyledFileLabelProviderExtension.POINT_ID);
                    }
                    getStyledText(file) {
                        if (ide.core.code.isNodeLibraryFile(file) || ide.core.code.isCopiedLibraryFile(file)) {
                            const theme = controls.Controls.getTheme();
                            return [{
                                    color: theme.viewerForeground + "90",
                                    text: file.getName()
                                }];
                        }
                    }
                }
                viewers.LibraryFileStyledLabelProviderExtension = LibraryFileStyledLabelProviderExtension;
            })(viewers = ui.viewers || (ui.viewers = {}));
        })(ui = ide.ui || (ide.ui = {}));
    })(ide = phasereditor2d.ide || (phasereditor2d.ide = {}));
})(phasereditor2d || (phasereditor2d = {}));
var phasereditor2d;
(function (phasereditor2d) {
    var ide;
    (function (ide) {
        var ui;
        (function (ui) {
            var viewers;
            (function (viewers) {
                var controls = colibri.ui.controls;
                class ProjectCellRendererProvider {
                    getCellRenderer(element) {
                        return new controls.viewers.IconImageCellRenderer(phasereditor2d.resources.getIcon(phasereditor2d.resources.ICON_PROJECT));
                    }
                    preload(element) {
                        return controls.Controls.resolveNothingLoaded();
                    }
                }
                viewers.ProjectCellRendererProvider = ProjectCellRendererProvider;
            })(viewers = ui.viewers || (ui.viewers = {}));
        })(ui = ide.ui || (ide.ui = {}));
    })(ide = phasereditor2d.ide || (phasereditor2d.ide = {}));
})(phasereditor2d || (phasereditor2d = {}));
