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
                // editors
                reg.addExtension(new colibri.ui.ide.EditorExtension([
                    new code.ui.editors.MonacoEditorFactory("javascript", phasereditor2d.webContentTypes.core.CONTENT_TYPE_JAVASCRIPT),
                    new code.ui.editors.MonacoEditorFactory("typescript", phasereditor2d.webContentTypes.core.CONTENT_TYPE_SCRIPT),
                    new code.ui.editors.MonacoEditorFactory("html", phasereditor2d.webContentTypes.core.CONTENT_TYPE_HTML),
                    new code.ui.editors.MonacoEditorFactory("css", phasereditor2d.webContentTypes.core.CONTENT_TYPE_CSS),
                    new code.ui.editors.MonacoEditorFactory("json", phasereditor2d.webContentTypes.core.CONTENT_TYPE_JSON),
                    new code.ui.editors.MonacoEditorFactory("xml", phasereditor2d.webContentTypes.core.CONTENT_TYPE_XML),
                    new code.ui.editors.MonacoEditorFactory("text", phasereditor2d.webContentTypes.core.CONTENT_TYPE_TEXT),
                ]));
            }
            async starting() {
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
                            const contentType = colibri.Platform.getWorkbench()
                                .getContentTypeRegistry().getCachedContentType(input);
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
                        if (super.onPartClosed()) {
                            if (this._monacoEditor) {
                                this._monacoEditor.dispose();
                            }
                            return true;
                        }
                        return false;
                    }
                    createPart() {
                        const container = document.createElement("div");
                        container.classList.add("MonacoEditorContainer");
                        this.getElement().appendChild(container);
                        this._monacoEditor = this.createMonacoEditor(container);
                        this._monacoEditor.onDidChangeModelContent(e => {
                            this.setDirty(true);
                        });
                        this.updateContent();
                    }
                    getTokensAtLine(position) {
                        const model = this._monacoEditor.getModel();
                        const line = model.getLineContent(position.lineNumber);
                        const tokens = monaco.editor.tokenize(line, this._language);
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
                        if (!this._monacoEditor) {
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
                        this.updateContent();
                    }
                }
                editors.MonacoEditor = MonacoEditor;
            })(editors = ui.editors || (ui.editors = {}));
        })(ui = code.ui || (code.ui = {}));
    })(code = phasereditor2d.code || (phasereditor2d.code = {}));
})(phasereditor2d || (phasereditor2d = {}));
