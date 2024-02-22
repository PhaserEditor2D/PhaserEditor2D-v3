var phasereditor2d;
(function (phasereditor2d) {
    var codemirror;
    (function (codemirror) {
        class CodeMirrorPlugin extends colibri.Plugin {
            static _instance;
            static getInstance() {
                return this._instance ?? (this._instance = new CodeMirrorPlugin());
            }
            constructor() {
                super("phasereditor2d.codemirror");
            }
            registerExtensions(reg) {
                // editors
                const defaultFactory = codemirror.ui.editors.TextCodeMirrorEditor.makeFactory("Text Editor", phasereditor2d.webContentTypes.core.CONTENT_TYPE_TEXT, "text");
                reg.addExtension(new colibri.ui.ide.EditorExtension([
                    codemirror.ui.editors.TextCodeMirrorEditor.makeFactory("JavaScript Editor", phasereditor2d.webContentTypes.core.CONTENT_TYPE_JAVASCRIPT, "javascript"),
                    codemirror.ui.editors.TextCodeMirrorEditor.makeFactory("TypeScript Editor", phasereditor2d.webContentTypes.core.CONTENT_TYPE_TYPESCRIPT, "javascript"),
                    codemirror.ui.editors.TextCodeMirrorEditor.makeFactory("HTML Editor", phasereditor2d.webContentTypes.core.CONTENT_TYPE_HTML, "htmlmixed"),
                    codemirror.ui.editors.TextCodeMirrorEditor.makeFactory("CSS Editor", phasereditor2d.webContentTypes.core.CONTENT_TYPE_CSS, "css"),
                    codemirror.ui.editors.TextCodeMirrorEditor.makeFactory("JSON Editor", phasereditor2d.webContentTypes.core.CONTENT_TYPE_JSON, "javascript"),
                    codemirror.ui.editors.TextCodeMirrorEditor.makeFactory("XML Editor", phasereditor2d.webContentTypes.core.CONTENT_TYPE_XML, "xml"),
                    defaultFactory,
                ]));
                // default editor factory
                colibri.Platform.getWorkbench()
                    .getEditorRegistry().registerDefaultFactory(defaultFactory);
            }
        }
        codemirror.CodeMirrorPlugin = CodeMirrorPlugin;
        colibri.Platform.addPlugin(CodeMirrorPlugin.getInstance());
    })(codemirror = phasereditor2d.codemirror || (phasereditor2d.codemirror = {}));
})(phasereditor2d || (phasereditor2d = {}));
// tslint:disable
// Type definitions for codemirror
// Project: https://github.com/marijnh/CodeMirror
// Definitions by: mihailik <https://github.com/mihailik>
//                 nrbernard <https://github.com/nrbernard>
//                 Pr1st0n <https://github.com/Pr1st0n>
//                 rileymiller <https://github.com/rileymiller>
//                 toddself <https://github.com/toddself>
//                 ysulyma <https://github.com/ysulyma>
//                 azoson <https://github.com/azoson>
//                 kylesferrazza <https://github.com/kylesferrazza>
//                 fityocsaba96 <https://github.com/fityocsaba96>
//                 koddsson <https://github.com/koddsson>
//                 ficristo <https://github.com/ficristo>
// Definitions: https://github.com/DefinitelyTyped/DefinitelyTyped
// TypeScript Version: 3.2
var phasereditor2d;
(function (phasereditor2d) {
    var codemirror;
    (function (codemirror) {
        var ui;
        (function (ui) {
            var editors;
            (function (editors) {
                var controls = colibri.ui.controls;
                class CodeMirrorEditor extends colibri.ui.ide.FileEditor {
                    _codeEditor;
                    _mode;
                    _themeListener;
                    constructor(id, factory, mode) {
                        super(id, factory);
                        this._mode = mode;
                    }
                    onEditorInputContentChangedByExternalEditor() {
                        this.updateContent();
                    }
                    createPart() {
                        this._codeEditor = CodeMirror(this.getElement(), {
                            mode: this._mode,
                            lineNumbers: true,
                            showCursorWhenSelecting: true,
                            tabSize: 4,
                            indentWithTabs: true,
                            autofocus: true,
                            indentUnit: 4
                        });
                        this._codeEditor.setOption("styleActiveLine", true);
                        this._codeEditor.on("change", () => {
                            this.setDirty(true);
                        });
                        this.updateEditorWithTheme();
                        this.updateContent();
                        this._themeListener = () => this.updateEditorWithTheme();
                        colibri.Platform.getWorkbench().eventThemeChanged.addListener(this._themeListener);
                    }
                    updateEditorWithTheme() {
                        const theme = controls.Controls.getTheme();
                        this._codeEditor.setOption("theme", theme.dark ? "darcula" : "default");
                    }
                    layout() {
                        super.layout();
                        if (this._codeEditor) {
                            const element = this._codeEditor.getWrapperElement();
                            const b = this.getElement().getBoundingClientRect();
                            element.style.width = b.width + "px";
                            element.style.height = b.height + "px";
                            this._codeEditor.refresh();
                        }
                    }
                    async doSave() {
                        const content = this._codeEditor.getValue();
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
                        if (!this._codeEditor) {
                            return;
                        }
                        const content = await colibri.ui.ide.FileUtils.preloadAndGetFileString(file);
                        this._codeEditor.setValue(content);
                        this.setDirty(false);
                    }
                }
                editors.CodeMirrorEditor = CodeMirrorEditor;
            })(editors = ui.editors || (ui.editors = {}));
        })(ui = codemirror.ui || (codemirror.ui = {}));
    })(codemirror = phasereditor2d.codemirror || (phasereditor2d.codemirror = {}));
})(phasereditor2d || (phasereditor2d = {}));
var phasereditor2d;
(function (phasereditor2d) {
    var codemirror;
    (function (codemirror) {
        var ui;
        (function (ui) {
            var editors;
            (function (editors) {
                class TextCodeMirrorEditor extends editors.CodeMirrorEditor {
                    static makeFactory(editorName, contentType, mode) {
                        return new colibri.ui.ide.ContentTypeEditorFactory(editorName, contentType, factory => new TextCodeMirrorEditor("phasereditor2d.codemirror.ui.editors." + editorName, factory, mode));
                    }
                    constructor(id, factory, mode) {
                        super(id, factory, mode);
                    }
                }
                editors.TextCodeMirrorEditor = TextCodeMirrorEditor;
            })(editors = ui.editors || (ui.editors = {}));
        })(ui = codemirror.ui || (codemirror.ui = {}));
    })(codemirror = phasereditor2d.codemirror || (phasereditor2d.codemirror = {}));
})(phasereditor2d || (phasereditor2d = {}));
