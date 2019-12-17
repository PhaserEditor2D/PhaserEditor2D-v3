namespace phasereditor2d.code {

    import controls = colibri.ui.controls;

    export class CodePlugin extends colibri.Plugin {

        private static _instance: CodePlugin;
        private _modelsManager: ui.editors.MonacoModelsManager;

        static getInstance() {

            if (!this._instance) {
                this._instance = new CodePlugin();
            }

            return this._instance;
        }

        constructor() {
            super("phasereditor2d.core")
        }

        registerExtensions(reg: colibri.ExtensionRegistry) {

            // project preloaders

            this._modelsManager = new ui.editors.MonacoModelsManager();

            // reg.addExtension(colibri.ui.ide.PreloadProjectResourcesExtension.POINT_ID,
            //     new colibri.ui.ide.PreloadProjectResourcesExtension("phasereditor2d.code.ui.editors.EditorModelsManager",
            //         monitor => {
            //             return this._modelsManager.start(monitor);
            //         }));

            // editors

            reg.addExtension(
                new colibri.ui.ide.EditorExtension(
                    [
                        new ui.editors.JavaScriptEditorFactory(),
                        new ui.editors.MonacoEditorFactory("typescript", webContentTypes.core.CONTENT_TYPE_SCRIPT),
                        new ui.editors.MonacoEditorFactory("html", webContentTypes.core.CONTENT_TYPE_HTML),
                        new ui.editors.MonacoEditorFactory("css", webContentTypes.core.CONTENT_TYPE_CSS),
                        new ui.editors.MonacoEditorFactory("json", webContentTypes.core.CONTENT_TYPE_JSON),
                        new ui.editors.MonacoEditorFactory("xml", webContentTypes.core.CONTENT_TYPE_XML),
                        new ui.editors.MonacoEditorFactory("text", webContentTypes.core.CONTENT_TYPE_TEXT),
                    ])
            );
        }

        async starting() {

            this.initMonacoLanguages();

            this.initMonacoContentAssist();

            this.initMonacoThemes();
        }

        private initMonacoContentAssist() {

            monaco.languages.typescript.typescriptDefaults.setDiagnosticsOptions({
                noSemanticValidation: true
            });
        }

        private initMonacoLanguages() {

            monaco.languages.typescript.typescriptDefaults.setDiagnosticsOptions({
                noSemanticValidation: true
            });
        }

        private initMonacoThemes() {

            monaco.editor.defineTheme("vs", {
                inherit: true,
                base: "vs",
                rules: <any>[
                    {
                        background: "e2e2e2"
                    }],
                colors: {
                    "editor.background": "#eaeaea",
                    "editor.lineHighlightBackground": "#bad4ee88"
                }
            });

            monaco.editor.defineTheme("vs-dark", {
                inherit: true,
                base: "vs-dark",
                rules: <any>[
                    {
                        background: "222222"
                    }],
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

    colibri.Platform.addPlugin(CodePlugin.getInstance());
}