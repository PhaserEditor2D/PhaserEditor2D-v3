declare namespace phasereditor2d.code {
    class CodePlugin extends colibri.Plugin {
        private static _instance;
        static getInstance(): CodePlugin;
        constructor();
        registerExtensions(reg: colibri.ExtensionRegistry): void;
        starting(): Promise<void>;
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
//# sourceMappingURL=phasereditor2d.code.d.ts.map