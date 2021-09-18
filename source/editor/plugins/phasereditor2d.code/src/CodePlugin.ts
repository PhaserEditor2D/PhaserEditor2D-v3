namespace phasereditor2d.code {

    import controls = colibri.ui.controls;
    import io = colibri.core.io;

    export const ICON_SYMBOL_CLASS = "symbol-class";
    export const ICON_SYMBOL_CONSTANT = "symbol-constant";
    export const ICON_SYMBOL_FIELD = "symbol-field";
    export const ICON_SYMBOL_INTERFACE = "symbol-interface";
    export const ICON_SYMBOL_METHOD = "symbol-method";
    export const ICON_SYMBOL_NAMESPACE = "symbol-namespace";
    export const ICON_SYMBOL_PROPERTY = "symbol-property";
    export const ICON_SYMBOL_VARIABLE = "symbol-variable";

    export class CodePlugin extends colibri.Plugin {

        private static _instance: CodePlugin;
        private _javaScriptWorker: monaco.languages.typescript.TypeScriptWorker;
        private _modelManager: ui.ModelManager;

        static getInstance() {

            if (!this._instance) {
                this._instance = new CodePlugin();
            }

            return this._instance;
        }

        constructor() {
            super("phasereditor2d.code");
        }

        registerExtensions(reg: colibri.ExtensionRegistry) {

            // icons loader

            reg.addExtension(
                colibri.ui.ide.IconLoaderExtension.withPluginFiles(this, [
                    ICON_SYMBOL_CLASS,
                    ICON_SYMBOL_CONSTANT,
                    ICON_SYMBOL_FIELD,
                    ICON_SYMBOL_INTERFACE,
                    ICON_SYMBOL_METHOD,
                    ICON_SYMBOL_NAMESPACE,
                    ICON_SYMBOL_PROPERTY,
                    ICON_SYMBOL_VARIABLE
                ])
            );

            // editors

            reg.addExtension(
                new colibri.ui.ide.EditorExtension(
                    [
                        ui.editors.JavaScriptEditor.getJavaScriptFactory(),
                        ui.editors.JavaScriptEditor.getTypeScriptFactory(),
                        ui.editors.HTMLEditor.getFactory(),
                        ui.editors.CSSEditor.getFactory(),
                        ui.editors.JSONEditor.getFactory(),
                        ui.editors.XMLEditor.getFactory(),
                        ui.editors.TextEditor.getFactory(),
                    ])
            );

            // default editor factory

            colibri.Platform.getWorkbench().getEditorRegistry().registerDefaultFactory(ui.editors.TextEditor.getFactory());

            // extra libs loader

            monaco.languages.typescript.javascriptDefaults.setEagerModelSync(true);

            // reg.addExtension(new ui.PreloadExtraLibsExtension());
            reg.addExtension(new ui.PreloadModelsExtension());
            reg.addExtension(new ui.PreloadJavaScriptWorkerExtension());
        }

        async getJavaScriptWorker() {

            if (this._javaScriptWorker) {

                return this._javaScriptWorker;
            }

            const getWorker = await monaco.languages.typescript.getJavaScriptWorker();

            this._javaScriptWorker = await getWorker();

            return this._javaScriptWorker;
        }

        static fileUri(file: io.FilePath | string) {

            if (file instanceof io.FilePath) {

                return monaco.Uri.file(file.getFullName());
            }

            return monaco.Uri.file(file);
        }

        getModelManager() {

            return this._modelManager;
        }

        async starting() {

            this._modelManager = new ui.ModelManager();

            // theme

            monaco.editor.defineTheme("vs", {
                inherit: true,
                base: "vs",
                rules: [
                    {
                        background: "e2e2e2"
                    }] as any,
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
                    }] as any,
                colors: {
                    "editor.background": "#2e2e2e",
                    "editor.lineHighlightBackground": "#3e3e3e88"
                }
            });

            colibri.Platform.getWorkbench().eventThemeChanged.addListener(() => {

                let monacoTheme = "vs";

                if (controls.Controls.getTheme().dark) {

                    monacoTheme = "vs-dark";
                }

                monaco.editor.setTheme(monacoTheme);
            });

            this.customizeMonaco();
        }

        private customizeMonaco() {

            const opts = monaco.languages.typescript.javascriptDefaults.getCompilerOptions();

            opts.target = monaco.languages.typescript.ScriptTarget.ESNext;
            opts.module = monaco.languages.typescript.ModuleKind.ESNext;

            this.customizeCodeServiceImpl();
        }

        private customizeCodeServiceImpl() {

            const require = window["require"];

            const module = require("vs/editor/standalone/browser/standaloneCodeServiceImpl");

            const StandaloneCodeEditorServiceImpl = module.StandaloneCodeEditorServiceImpl;

            StandaloneCodeEditorServiceImpl.prototype.openCodeEditor =
                (input: any, editor: monaco.editor.IStandaloneCodeEditor, sideBySide: boolean) => {

                    const uri = input.resource as monaco.Uri;

                    const fileName = uri.path.substring(1);

                    const file = colibri.ui.ide.FileUtils.getFileFromPath(fileName);

                    if (file) {

                        const editorPart = colibri.Platform
                            .getWorkbench().openEditor(file) as ui.editors.JavaScriptEditor;

                        if (!editorPart) {

                            return;
                        }

                        // TODO: for now, but the right way is to pass a "RevealElement" in the .openEditor() method
                        setTimeout(() => {

                            const newEditor = editorPart.getMonacoEditor();

                            const selection = input.options ? input.options.selection : null;

                            if (selection) {

                                if (typeof selection.endLineNumber === "number"
                                    && typeof selection.endColumn === "number") {

                                    newEditor.setSelection(selection);
                                    newEditor.revealRangeInCenter(selection, monaco.editor.ScrollType.Immediate);

                                } else {

                                    const pos = {
                                        lineNumber: selection.startLineNumber,
                                        column: selection.startColumn
                                    };

                                    newEditor.setPosition(pos);
                                    newEditor.revealPositionInCenter(pos, monaco.editor.ScrollType.Immediate);
                                }
                            }
                        }, 10);

                    } else {

                        alert("File not found '" + fileName + "'");
                    }

                    return Promise.resolve(editor);
                };
        }
    }

    colibri.Platform.addPlugin(CodePlugin.getInstance());
}