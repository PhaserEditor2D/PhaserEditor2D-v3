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
    abstract class MonacoEditor extends colibri.ui.ide.FileEditor {
        private _monacoEditor;
        private _language;
        private _outlineProvider;
        private _modelLines;
        constructor(id: string, language: string);
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
    class JavaScriptEditor extends MonacoEditor {
        static _factory: colibri.ui.ide.EditorFactory;
        static getFactory(): colibri.ui.ide.EditorFactory;
        private _worker;
        constructor();
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
        constructor(editor: MonacoEditor);
        getContentProvider(): controls.viewers.ITreeContentProvider;
        getLabelProvider(): controls.viewers.ILabelProvider;
        getCellRendererProvider(): controls.viewers.ICellRendererProvider;
        getTreeViewerRenderer(viewer: controls.viewers.TreeViewer): controls.viewers.TreeViewerRenderer;
        getPropertySectionProvider(): controls.properties.PropertySectionProvider;
        getInput(): colibri.core.io.FilePath;
        getItems(): any[];
        preload(): Promise<void>;
        refresh(): Promise<void>;
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