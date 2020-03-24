declare namespace phasereditor2d.code {
    const ICON_SYMBOL_CLASS = "symbol-class";
    const ICON_SYMBOL_CONSTANT = "symbol-constant";
    const ICON_SYMBOL_FIELD = "symbol-field";
    const ICON_SYMBOL_INTERFACE = "symbol-interface";
    const ICON_SYMBOL_METHOD = "symbol-method";
    const ICON_SYMBOL_NAMESPACE = "symbol-namespace";
    const ICON_SYMBOL_PROPERTY = "symbol-property";
    const ICON_SYMBOL_VARIABLE = "symbol-variable";
    class CodePlugin extends colibri.Plugin {
        private static _instance;
        static getInstance(): CodePlugin;
        constructor();
        registerExtensions(reg: colibri.ExtensionRegistry): void;
        starting(): Promise<void>;
    }
}
declare namespace phasereditor2d.code.ui {
    class PreloadExtraLibsExtension extends colibri.ui.ide.PreloadProjectResourcesExtension {
        computeTotal(): Promise<number>;
        private getFiles;
        preload(monitor: colibri.ui.controls.IProgressMonitor): Promise<void>;
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
        private _outlineProvider;
        private _modelLines;
        constructor(language: string);
        getMonacoEditor(): monaco.editor.IStandaloneCodeEditor;
        onPartClosed(): boolean;
        protected createPart(): void;
        private getTokensAtLine;
        protected createMonacoEditor(container: HTMLElement): monaco.editor.IStandaloneCodeEditor;
        protected createMonacoEditorOptions(): monaco.editor.IStandaloneEditorConstructionOptions;
        doSave(): Promise<void>;
        private updateContent;
        private registerModelListeners;
        getEditorViewerProvider(key: string): outline.MonacoEditorOutlineProvider;
        refreshOutline(): Promise<void>;
        layout(): void;
        protected onEditorInputContentChanged(): void;
    }
}
declare class MonacoEditorViewerProvider extends colibri.ui.ide.EditorViewerProvider {
    getContentProvider(): colibri.ui.controls.viewers.ITreeContentProvider;
    getLabelProvider(): colibri.ui.controls.viewers.ILabelProvider;
    getCellRendererProvider(): colibri.ui.controls.viewers.ICellRendererProvider;
    getTreeViewerRenderer(viewer: colibri.ui.controls.viewers.TreeViewer): colibri.ui.controls.viewers.TreeViewerRenderer;
    getPropertySectionProvider(): colibri.ui.controls.properties.PropertySectionProvider;
    getInput(): void;
    preload(): Promise<void>;
    getUndoManager(): void;
}
declare namespace phasereditor2d.code.ui.editors.outline {
    import controls = colibri.ui.controls;
    class MonacoEditorOutlineProvider extends colibri.ui.ide.EditorViewerProvider {
        private _editor;
        private _items;
        constructor(editor: MonacoEditor);
        getContentProvider(): controls.viewers.ITreeContentProvider;
        getLabelProvider(): controls.viewers.ILabelProvider;
        getCellRendererProvider(): controls.viewers.ICellRendererProvider;
        getTreeViewerRenderer(viewer: controls.viewers.TreeViewer): controls.viewers.TreeViewerRenderer;
        getPropertySectionProvider(): controls.properties.PropertySectionProvider;
        getInput(): colibri.core.io.FilePath;
        getItems(): any[];
        preload(): Promise<void>;
        private _worker;
        requestOutlineElements(): Promise<void>;
        getUndoManager(): colibri.ui.ide.undo.UndoManager;
    }
}
declare namespace phasereditor2d.code.ui.editors.outline {
    import controls = colibri.ui.controls;
    class MonacoOutlineCellRendererProvider implements controls.viewers.ICellRendererProvider {
        private static map;
        getCellRenderer(obj: any): controls.viewers.ICellRenderer;
        preload(args: controls.viewers.PreloadCellArgs): Promise<controls.PreloadResult>;
    }
}
declare namespace phasereditor2d.code.ui.editors.outline {
    import controls = colibri.ui.controls;
    class MonacoOutlineContentProvider implements controls.viewers.ITreeContentProvider {
        private _provider;
        constructor(provider: MonacoEditorOutlineProvider);
        getRoots(input: any): any[];
        getChildren(parent: any): any[];
    }
}
//# sourceMappingURL=phasereditor2d.code.d.ts.map