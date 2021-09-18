namespace phasereditor2d.codemirror {

    export class CodeMirrorPlugin extends colibri.Plugin {

        private static _instance: CodeMirrorPlugin;

        static getInstance() {

            return this._instance ?? (this._instance = new CodeMirrorPlugin());
        }

        private constructor() {
            super("phasereditor2d.codemirror");
        }

        registerExtensions(reg: colibri.ExtensionRegistry) {

            // editors

            const defaultFactory = ui.editors.TextCodeMirrorEditor.makeFactory(
                "Text Editor", webContentTypes.core.CONTENT_TYPE_TEXT, "text");

            reg.addExtension(
                new colibri.ui.ide.EditorExtension(
                    [
                        ui.editors.TextCodeMirrorEditor.makeFactory(
                            "JavaScript Editor", webContentTypes.core.CONTENT_TYPE_JAVASCRIPT, "javascript"),

                        ui.editors.TextCodeMirrorEditor.makeFactory(
                            "TypeScript Editor", webContentTypes.core.CONTENT_TYPE_TYPESCRIPT, "javascript"),

                        ui.editors.TextCodeMirrorEditor.makeFactory(
                            "HTML Editor", webContentTypes.core.CONTENT_TYPE_HTML, "htmlmixed"),

                        ui.editors.TextCodeMirrorEditor.makeFactory(
                            "CSS Editor", webContentTypes.core.CONTENT_TYPE_CSS, "css"),

                        ui.editors.TextCodeMirrorEditor.makeFactory(
                            "JSON Editor", webContentTypes.core.CONTENT_TYPE_JSON, "javascript"),

                        ui.editors.TextCodeMirrorEditor.makeFactory(
                            "XML Editor", webContentTypes.core.CONTENT_TYPE_XML, "xml"),

                        defaultFactory,
                    ])
            );

            // default editor factory

            colibri.Platform.getWorkbench()
                .getEditorRegistry().registerDefaultFactory(defaultFactory);
        }
    }

    colibri.Platform.addPlugin(CodeMirrorPlugin.getInstance());
}