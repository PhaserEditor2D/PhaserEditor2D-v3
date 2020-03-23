namespace phasereditor2d.code {

    import controls = colibri.ui.controls;

    export class CodePlugin extends colibri.Plugin {

        private static _instance: CodePlugin;

        static getInstance() {

            if (!this._instance) {
                this._instance = new CodePlugin();
            }

            return this._instance;
        }

        constructor() {
            super("phasereditor2d.core");
        }

        registerExtensions(reg: colibri.ExtensionRegistry) {

            // editors

            reg.addExtension(
                new colibri.ui.ide.EditorExtension(
                    [
                        new ui.editors.MonacoEditorFactory("javascript", webContentTypes.core.CONTENT_TYPE_JAVASCRIPT),
                        new ui.editors.MonacoEditorFactory("typescript", webContentTypes.core.CONTENT_TYPE_SCRIPT),
                        new ui.editors.MonacoEditorFactory("html", webContentTypes.core.CONTENT_TYPE_HTML),
                        new ui.editors.MonacoEditorFactory("css", webContentTypes.core.CONTENT_TYPE_CSS),
                        new ui.editors.MonacoEditorFactory("json", webContentTypes.core.CONTENT_TYPE_JSON),
                        new ui.editors.MonacoEditorFactory("xml", webContentTypes.core.CONTENT_TYPE_XML),
                        new ui.editors.MonacoEditorFactory("text", webContentTypes.core.CONTENT_TYPE_TEXT),
                    ])
            );

            // extra libs loader

            reg.addExtension(new ui.PreloadExtraLibsExtension());

        }

        async starting() {

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