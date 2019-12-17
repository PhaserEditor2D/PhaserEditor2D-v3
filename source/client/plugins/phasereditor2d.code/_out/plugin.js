var phasereditor2d;
(function (phasereditor2d) {
    var code;
    (function (code) {
        var controls = colibri.ui.controls;
        class CodePlugin extends colibri.Plugin {
            constructor() {
                super("phasereditor2d.core");
            }
            static getInstance() {
                if (!this._instance) {
                    this._instance = new CodePlugin();
                }
                return this._instance;
            }
            registerExtensions(reg) {
                // project preloaders
                this._modelsManager = new code.ui.editors.MonacoModelsManager();
                // reg.addExtension(colibri.ui.ide.PreloadProjectResourcesExtension.POINT_ID,
                //     new colibri.ui.ide.PreloadProjectResourcesExtension("phasereditor2d.code.ui.editors.EditorModelsManager",
                //         monitor => {
                //             return this._modelsManager.start(monitor);
                //         }));
                // editors
                reg.addExtension(new colibri.ui.ide.EditorExtension([
                    new code.ui.editors.JavaScriptEditorFactory(),
                    new code.ui.editors.MonacoEditorFactory("typescript", phasereditor2d.webContentTypes.core.CONTENT_TYPE_SCRIPT),
                    new code.ui.editors.MonacoEditorFactory("html", phasereditor2d.webContentTypes.core.CONTENT_TYPE_HTML),
                    new code.ui.editors.MonacoEditorFactory("css", phasereditor2d.webContentTypes.core.CONTENT_TYPE_CSS),
                    new code.ui.editors.MonacoEditorFactory("json", phasereditor2d.webContentTypes.core.CONTENT_TYPE_JSON),
                    new code.ui.editors.MonacoEditorFactory("xml", phasereditor2d.webContentTypes.core.CONTENT_TYPE_XML),
                    new code.ui.editors.MonacoEditorFactory("text", phasereditor2d.webContentTypes.core.CONTENT_TYPE_TEXT),
                ]));
            }
            async starting() {
                this.initMonacoLanguages();
                this.initMonacoContentAssist();
                this.initMonacoThemes();
            }
            initMonacoContentAssist() {
                monaco.languages.typescript.typescriptDefaults.setDiagnosticsOptions({
                    noSemanticValidation: true
                });
            }
            initMonacoLanguages() {
                monaco.languages.typescript.typescriptDefaults.setDiagnosticsOptions({
                    noSemanticValidation: true
                });
            }
            initMonacoThemes() {
                monaco.editor.defineTheme("vs", {
                    inherit: true,
                    base: "vs",
                    rules: [
                        {
                            background: "e2e2e2"
                        }
                    ],
                    colors: {
                        "editor.background": "#eaeaea",
                        "editor.lineHighlightBackground": "#bad4ee88"
                    }
                });
                monaco.editor.defineTheme("vs-dark", {
                    inherit: true,
                    base: "vs-dark",
                    rules: [
                        {
                            background: "222222"
                        }
                    ],
                    colors: {
                        "editor.background": "#2e2e2e",
                        "editor.lineHighlightBackground": "#3e3e3e88"
                    }
                });
                window.addEventListener(controls.EVENT_THEME_CHANGED, e => {
                    let monacoTheme = "vs";
                    if (controls.Controls.getTheme().dark) {
                        monacoTheme = "vs-dark";
                    }
                    monaco.editor.setTheme(monacoTheme);
                });
            }
        }
        code.CodePlugin = CodePlugin;
        colibri.Platform.addPlugin(CodePlugin.getInstance());
    })(code = phasereditor2d.code || (phasereditor2d.code = {}));
})(phasereditor2d || (phasereditor2d = {}));
var phasereditor2d;
(function (phasereditor2d) {
    var code;
    (function (code) {
        var ui;
        (function (ui) {
            var editors;
            (function (editors) {
                var io = colibri.core.io;
                class MonacoEditorFactory extends colibri.ui.ide.EditorFactory {
                    constructor(language, contentType) {
                        super("phasereditor2d.core.ui.editors.MonacoEditorFactory#" + language);
                        this._language = language;
                        this._contentType = contentType;
                    }
                    acceptInput(input) {
                        if (input instanceof io.FilePath) {
                            const contentType = colibri.Platform.getWorkbench().getContentTypeRegistry().getCachedContentType(input);
                            return this._contentType === contentType;
                        }
                        return false;
                    }
                    createEditor() {
                        return new MonacoEditor(this._language);
                    }
                }
                editors.MonacoEditorFactory = MonacoEditorFactory;
                class MonacoEditor extends colibri.ui.ide.FileEditor {
                    constructor(language) {
                        super("phasereditor2d.core.ui.editors.JavaScriptEditor");
                        this.addClass("MonacoEditor");
                        this._language = language;
                    }
                    getMonacoEditor() {
                        return this._monacoEditor;
                    }
                    onPartClosed() {
                        if (this._monacoEditor) {
                            this._monacoEditor.dispose();
                        }
                        return super.onPartClosed();
                    }
                    createPart() {
                        const container = document.createElement("div");
                        container.classList.add("MonacoEditorContainer");
                        this.getElement().appendChild(container);
                        this._monacoEditor = this.createMonacoEditor(container);
                        this._monacoEditor.onDidChangeModelContent(e => {
                            this.setDirty(true);
                        });
                        editors.MonacoModelsManager.getInstance().start();
                        this.updateContent();
                    }
                    getTokensAtLine(position) {
                        const model = this._monacoEditor.getModel();
                        const line = model.getLineContent(position.lineNumber);
                        const tokens = monaco.editor.tokenize(line, this._language);
                        let n = 0;
                        let type = "unknown";
                        for (const token of tokens[0]) {
                            if (position.column >= token.offset) {
                                type = token.type;
                            }
                        }
                        return type;
                    }
                    createMonacoEditor(container) {
                        return monaco.editor.create(container, this.createMonacoEditorOptions());
                    }
                    createMonacoEditorOptions() {
                        return {
                            language: this._language,
                            fontSize: 16,
                            scrollBeyondLastLine: false
                        };
                    }
                    async doSave() {
                        const content = this._monacoEditor.getValue();
                        try {
                            await colibri.ui.ide.FileUtils.setFileString_async(this.getInput(), content);
                            this.setDirty(false);
                        }
                        catch (e) {
                            console.error(e);
                        }
                    }
                    async updateContent() {
                        const file = this.getInput();
                        if (!file) {
                            return;
                        }
                        const content = await colibri.ui.ide.FileUtils.preloadAndGetFileString(file);
                        this._monacoEditor.setValue(content);
                        this.setDirty(false);
                    }
                    layout() {
                        super.layout();
                        if (this._monacoEditor) {
                            this._monacoEditor.layout();
                        }
                    }
                    onEditorInputContentChanged() {
                    }
                }
                editors.MonacoEditor = MonacoEditor;
            })(editors = ui.editors || (ui.editors = {}));
        })(ui = code.ui || (code.ui = {}));
    })(code = phasereditor2d.code || (phasereditor2d.code = {}));
})(phasereditor2d || (phasereditor2d = {}));
/// <reference path="./MonacoEditor.ts" />
var phasereditor2d;
(function (phasereditor2d) {
    var code;
    (function (code) {
        var ui;
        (function (ui) {
            var editors;
            (function (editors) {
                class JavaScriptEditorFactory extends editors.MonacoEditorFactory {
                    constructor() {
                        super("javascript", phasereditor2d.webContentTypes.core.CONTENT_TYPE_JAVASCRIPT);
                    }
                    createEditor() {
                        return new JavaScriptEditor();
                    }
                }
                editors.JavaScriptEditorFactory = JavaScriptEditorFactory;
                function registerJavaScriptEditorCompletions() {
                    monaco.languages.registerCompletionItemProvider("javascript", {
                        provideCompletionItems: (model, pos) => {
                            return {
                                suggestions: computeCompletionItems(),
                            };
                        }
                    });
                }
                function computeCompletionItems() {
                    const result = [];
                    //TODO: missing preload finder, but we need to compute the completions async, we should look in the monaco docs.
                    const finder = new phasereditor2d.pack.core.PackFinder();
                    const packs = finder.getPacks();
                    for (const pack_ of packs) {
                        const packName = pack_.getFile().getName();
                        for (const item of pack_.getItems()) {
                            result.push({
                                label: `${item.getKey()}`,
                                kind: monaco.languages.CompletionItemKind.Text,
                                documentation: `Asset Pack key of type ${item.getType()} (in ${packName}).`,
                                insertText: `"${item.getKey()}"`,
                            });
                            if (item instanceof phasereditor2d.pack.core.ImageFrameContainerAssetPackItem
                                && !(item instanceof phasereditor2d.pack.core.ImageAssetPackItem)) {
                                for (const frame of item.getFrames()) {
                                    result.push({
                                        label: `${frame.getName()}`,
                                        kind: monaco.languages.CompletionItemKind.Text,
                                        documentation: `Frame of the ${item.getType()} ${item.getKey()} (in ${packName}).`,
                                        insertText: `"${frame.getName()}"`,
                                    });
                                }
                            }
                        }
                    }
                    return result;
                }
                class JavaScriptEditor extends editors.MonacoEditor {
                    constructor() {
                        super("javascript");
                        this._propertyProvider = new phasereditor2d.pack.ui.properties.AssetPackPreviewPropertyProvider();
                        if (!JavaScriptEditor._init) {
                            JavaScriptEditor._init = true;
                            JavaScriptEditor.init();
                        }
                    }
                    static init() {
                        registerJavaScriptEditorCompletions();
                    }
                    createPart() {
                        super.createPart();
                        const editor = this.getMonacoEditor();
                        editor.onDidChangeCursorPosition(e => {
                            const model = editor.getModel();
                            const str = getStringTokenValue(model, e.position);
                            if (str) {
                                this.setSelection([str]);
                                const finder = new phasereditor2d.pack.core.PackFinder();
                                finder.preload().then(() => {
                                    const obj = finder.findPackItemOrFrameWithKey(str);
                                    this.setSelection([obj]);
                                });
                            }
                            else if (this.getSelection().length > 0) {
                                this.setSelection([]);
                            }
                        });
                    }
                    getPropertyProvider() {
                        return this._propertyProvider;
                    }
                }
                JavaScriptEditor._init = false;
                editors.JavaScriptEditor = JavaScriptEditor;
                function getStringTokenValue(model, pos) {
                    const input = model.getLineContent(pos.lineNumber);
                    const cursor = pos.column - 1;
                    let i = 0;
                    let tokenOffset = 0;
                    let openChar = "";
                    while (i < input.length) {
                        const c = input[i];
                        if (openChar === c) {
                            // end string token
                            if (cursor >= tokenOffset && cursor <= i) {
                                return input.slice(tokenOffset, i);
                            }
                            openChar = "";
                        }
                        else if (c === "'" || c === '"') {
                            // start string token
                            openChar = c;
                            tokenOffset = i + 1;
                        }
                        i++;
                    }
                }
            })(editors = ui.editors || (ui.editors = {}));
        })(ui = code.ui || (code.ui = {}));
    })(code = phasereditor2d.code || (phasereditor2d.code = {}));
})(phasereditor2d || (phasereditor2d = {}));
var phasereditor2d;
(function (phasereditor2d) {
    var code;
    (function (code) {
        var ui;
        (function (ui) {
            var editors;
            (function (editors) {
                class MonacoModelsManager {
                    constructor() {
                        this._started = false;
                        this._extraLibs = [];
                    }
                    static getInstance() {
                        if (!this._instance) {
                            this._instance = new MonacoModelsManager();
                        }
                        return this._instance;
                    }
                    async start() {
                        if (this._started) {
                            return;
                        }
                        this._started = true;
                        this.updateExtraLibs();
                        colibri.Platform.getWorkbench().getFileStorage().addChangeListener(change => this.onStorageChanged(change));
                    }
                    onStorageChanged(change) {
                        console.info(`MonacoModelsManager: storage changed.`);
                        const test = (paths) => {
                            for (const r of paths) {
                                if (r.endsWith(".d.ts")) {
                                    return true;
                                }
                            }
                            return false;
                        };
                        const update = test(change.getDeleteRecords())
                            || test(change.getModifiedRecords())
                            || test(change.getRenameToRecords())
                            || test(change.getRenameFromRecords())
                            || test(change.getAddRecords());
                        if (update) {
                            this.updateExtraLibs();
                        }
                    }
                    async updateExtraLibs() {
                        console.log("MonacoModelsManager: updating extra libs.");
                        for (const lib of this._extraLibs) {
                            console.log(`MonacoModelsManager: disposing ${lib.file.getFullName()}`);
                            lib.disposable.dispose();
                        }
                        const files = colibri.ui.ide.FileUtils.getRoot().flatTree([], false);
                        const tsFiles = files.filter(file => file.getName().endsWith(".d.ts"));
                        for (const file of tsFiles) {
                            const content = await colibri.ui.ide.FileUtils.preloadAndGetFileString(file);
                            const d = monaco.languages.typescript.javascriptDefaults.addExtraLib(content);
                            console.log(`MonacoModelsManager: add extra lib ${file.getFullName()}`);
                            this._extraLibs.push({
                                disposable: d,
                                file: file
                            });
                        }
                    }
                }
                editors.MonacoModelsManager = MonacoModelsManager;
            })(editors = ui.editors || (ui.editors = {}));
        })(ui = code.ui || (code.ui = {}));
    })(code = phasereditor2d.code || (phasereditor2d.code = {}));
})(phasereditor2d || (phasereditor2d = {}));
