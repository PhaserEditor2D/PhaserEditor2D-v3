declare namespace phasereditor2d.inspector {
    const ICON_INSPECTOR = "inspector";
    class InspectorPlugin extends colibri.Plugin {
        private static _instance;
        static getInstance(): InspectorPlugin;
        private constructor();
        registerExtensions(reg: colibri.ExtensionRegistry): void;
    }
}
declare namespace phasereditor2d.inspector.ui.views {
    import ide = colibri.ui.ide;
    class InspectorView extends ide.ViewPart {
        private _propertyPage;
        private _currentPart;
        private _selectionListener;
        constructor();
        layout(): void;
        protected createPart(): void;
        private onWorkbenchPartActivate;
        private onPartSelection;
        getUndoManager(): ide.undo.UndoManager;
    }
}
//# sourceMappingURL=plugin.d.ts.map