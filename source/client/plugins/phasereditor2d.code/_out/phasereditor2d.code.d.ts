declare namespace phasereditor2d.code {
    class CodePlugin extends colibri.Plugin {
        private static _instance;
        private _modelsManager;
        static getInstance(): CodePlugin;
        constructor();
        getModelsManager(): ui.editors.MonacoModelsManager;
        registerExtensions(reg: colibri.ExtensionRegistry): void;
        starting(): Promise<void>;
        private initMonacoContentAssist;
        private initMonacoLanguages;
        private initMonacoThemes;
    }
}
declare namespace phasereditor2d.code.ui.editors {
    import io = colibri.core.io;
    import controls = colibri.ui.controls;
    class MonacoModelsManager {
        private _fileModelMap;
        private _changeListener;
        private _filesModifiedByMonacoEditor;
        constructor();
        fileModifiedByMonacoEditor(file: io.FilePath): void;
        private reset;
        preload(monitor: controls.IProgressMonitor): Promise<void>;
        private addSrcFile;
        private addDefFile;
        getModel(file: io.FilePath): monaco.editor.ITextModel;
    }
}
declare namespace phasereditor2d.code.ui.editors {
    class MonacoEditorFactory extends colibri.ui.ide.EditorFactory {
        private _language;
        private _contentType;
        constructor(language: string, contentType: string);
        acceptInput(input: any): boolean;
        createEditor(): colibri.ui.ide.EditorPart;
    }
    class MonacoEditor extends colibri.ui.ide.FileEditor {
        private static _factory;
        private _monacoEditor;
        private _language;
        constructor(language: string);
        protected getMonacoEditor(): monaco.editor.IStandaloneCodeEditor;
        onPartClosed(): boolean;
        protected createPart(): void;
        private getTokensAtLine;
        protected createMonacoEditor(container: HTMLElement): monaco.editor.IStandaloneCodeEditor;
        protected createMonacoEditorOptions(): monaco.editor.IEditorConstructionOptions;
        doSave(): Promise<void>;
        private updateContent;
        layout(): void;
        protected onEditorInputContentChanged(): void;
    }
}
declare namespace phasereditor2d.code.ui.editors {
    class JavaScriptEditorFactory extends MonacoEditorFactory {
        constructor();
        createEditor(): colibri.ui.ide.EditorPart;
    }
    class JavaScriptEditor extends MonacoEditor {
        private static _init;
        constructor();
        private static init;
        createPart(): void;
        private _propertyProvider;
        getPropertyProvider(): pack.ui.properties.AssetPackPreviewPropertyProvider;
    }
}
//# sourceMappingURL=phasereditor2d.code.d.ts.map