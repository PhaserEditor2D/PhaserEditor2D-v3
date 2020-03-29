declare namespace phasereditor2d.code {
    import io = colibri.core.io;
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
        private _modelManager;
        private _javaScriptWorker;
        static getInstance(): CodePlugin;
        constructor();
        registerExtensions(reg: colibri.ExtensionRegistry): void;
        getJavaScriptWorker(): monaco.languages.typescript.TypeScriptWorker;
        setJavaScriptWorker(worker: monaco.languages.typescript.TypeScriptWorker): void;
        static fileUri(file: io.FilePath | string): monaco.Uri;
        isAdvancedJSEditor(): boolean;
        starting(): Promise<void>;
        private customizeMonaco;
    }
}
declare namespace phasereditor2d.code.ui {
    class ModelManager {
        constructor();
    }
}
declare namespace phasereditor2d.code.ui {
    class PreloadExtraLibsExtension extends colibri.ui.ide.PreloadProjectResourcesExtension {
        computeTotal(): Promise<number>;
        private getFiles;
        preload(monitor: colibri.ui.controls.IProgressMonitor): Promise<void>;
    }
}
declare namespace phasereditor2d.code.ui {
    class PreloadJavaScriptWorkerExtension extends colibri.ui.ide.PreloadProjectResourcesExtension {
        computeTotal(): Promise<number>;
        preload(monitor: colibri.ui.controls.IProgressMonitor): Promise<void>;
    }
}
declare namespace phasereditor2d.code.ui {
    class PreloadModelsExtension extends colibri.ui.ide.PreloadProjectResourcesExtension {
        computeTotal(): Promise<number>;
        private getFiles;
        preload(monitor: colibri.ui.controls.IProgressMonitor): Promise<void>;
    }
}
declare namespace phasereditor2d.code.ui.editors {
    abstract class MonacoEditor extends colibri.ui.ide.FileEditor {
        private _editor;
        protected _model: monaco.editor.ITextModel;
        private _language;
        private _outlineProvider;
        private _modelLines;
        private _onDidChangeContentListener;
        private _onDidChangeCountListener;
        constructor(id: string, language: string);
        getMonacoEditor(): monaco.editor.IStandaloneCodeEditor;
        onPartClosed(): boolean;
        onPartActivated(): void;
        protected disposeModel(): void;
        protected createPart(): void;
        private getTokensAtLine;
        doSave(): Promise<void>;
        private updateContent;
        protected createModel(file: colibri.core.io.FilePath): Promise<monaco.editor.ITextModel>;
        protected registerModelListeners(model: monaco.editor.ITextModel): void;
        protected removeModelListeners(): void;
        getEditorViewerProvider(key: string): outline.MonacoEditorOutlineProvider;
        refreshOutline(): Promise<void>;
        abstract requestOutlineItems(): Promise<any[]>;
        layout(): void;
        protected onEditorInputContentChanged(): void;
    }
}
declare namespace phasereditor2d.code.ui.editors {
    class CSSEditor extends MonacoEditor {
        static _factory: colibri.ui.ide.EditorFactory;
        static getFactory(): colibri.ui.ide.EditorFactory;
        constructor();
        requestOutlineItems(): Promise<any[]>;
    }
}
declare namespace phasereditor2d.code.ui.editors {
    class HTMLEditor extends MonacoEditor {
        static _factory: colibri.ui.ide.EditorFactory;
        static getFactory(): colibri.ui.ide.EditorFactory;
        constructor();
        requestOutlineItems(): Promise<any[]>;
    }
}
declare namespace phasereditor2d.code.ui.editors {
    class JSONEditor extends MonacoEditor {
        static _factory: colibri.ui.ide.EditorFactory;
        static getFactory(): colibri.ui.ide.EditorFactory;
        constructor();
        requestOutlineItems(): Promise<any[]>;
    }
}
declare namespace phasereditor2d.code.ui.editors {
    import io = colibri.core.io;
    class JavaScriptEditor extends MonacoEditor {
        static _factory: colibri.ui.ide.EditorFactory;
        private _propertyProvider;
        static getFactory(): colibri.ui.ide.EditorFactory;
        constructor();
        protected createModel(file: io.FilePath): Promise<monaco.editor.ITextModel>;
        protected onEditorFileNameChanged(): void;
        getPropertyProvider(): properties.JavaScriptSectionProvider;
        registerModelListeners(model: monaco.editor.ITextModel): void;
        protected disposeModel(): void;
        requestOutlineItems(): Promise<any[]>;
    }
}
declare namespace phasereditor2d.code.ui.editors {
    class TextEditor extends MonacoEditor {
        static _factory: colibri.ui.ide.EditorFactory;
        static getFactory(): colibri.ui.ide.EditorFactory;
        constructor();
        requestOutlineItems(): Promise<any[]>;
    }
}
declare namespace phasereditor2d.code.ui.editors {
    class TypeScriptEditor extends MonacoEditor {
        static _factory: colibri.ui.ide.EditorFactory;
        static getFactory(): colibri.ui.ide.EditorFactory;
        private _worker;
        constructor();
        requestOutlineItems(): Promise<any[]>;
    }
}
declare namespace phasereditor2d.code.ui.editors {
    class XMLEditor extends MonacoEditor {
        static _factory: colibri.ui.ide.EditorFactory;
        static getFactory(): colibri.ui.ide.EditorFactory;
        constructor();
        requestOutlineItems(): Promise<any[]>;
    }
}
declare namespace phasereditor2d.code.ui.editors.outline {
    import controls = colibri.ui.controls;
    class MonacoEditorOutlineProvider extends colibri.ui.ide.EditorViewerProvider {
        private _editor;
        private _items;
        private _itemsMap;
        constructor(editor: MonacoEditor);
        setViewer(viewer: controls.viewers.TreeViewer): void;
        prepareViewerState(state: controls.viewers.ViewerState): void;
        getContentProvider(): controls.viewers.ITreeContentProvider;
        getLabelProvider(): controls.viewers.ILabelProvider;
        getCellRendererProvider(): controls.viewers.ICellRendererProvider;
        getTreeViewerRenderer(viewer: controls.viewers.TreeViewer): controls.viewers.TreeViewerRenderer;
        getPropertySectionProvider(): controls.properties.PropertySectionProvider;
        getInput(): colibri.core.io.FilePath;
        getItems(): any[];
        preload(): Promise<void>;
        revealOffset(offset: number): void;
        private findItemAtOffset;
        refresh(): Promise<void>;
        private buildItemsMap;
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
declare namespace phasereditor2d.code.ui.editors.properties {
    class DocumentationItem {
        private _data;
        private _converter;
        constructor(data: any);
        getData(): any;
        toHTML(): string;
    }
}
declare namespace phasereditor2d.code.ui.editors.properties {
    import controls = colibri.ui.controls;
    class DocumentationSection extends controls.properties.PropertySection<DocumentationItem> {
        constructor(page: controls.properties.PropertyPage);
        protected createForm(parent: HTMLDivElement): void;
        canEdit(obj: any, n: number): boolean;
        canEditNumber(n: number): boolean;
    }
}
declare namespace phasereditor2d.code.ui.editors.properties {
    import controls = colibri.ui.controls;
    class JavaScriptSectionProvider extends controls.properties.PropertySectionProvider {
        addSections(page: controls.properties.PropertyPage, sections: Array<controls.properties.PropertySection<any>>): void;
    }
}
//# sourceMappingURL=phasereditor2d.code.d.ts.map