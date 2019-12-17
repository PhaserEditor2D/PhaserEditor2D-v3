declare namespace phasereditor2d.images {
    class ImagesPlugin extends colibri.Plugin {
        private static _instance;
        static getInstance(): ImagesPlugin;
        private constructor();
        registerExtensions(reg: colibri.ExtensionRegistry): void;
    }
}
declare namespace phasereditor2d.images.ui.editors {
    import ide = colibri.ui.ide;
    import controls = colibri.ui.controls;
    import io = colibri.core.io;
    class ImageEditor extends ide.FileEditor {
        private _imageControl;
        constructor();
        static getFactory(): ide.EditorFactory;
        protected onEditorInputContentChanged(): void;
        createPart(): Promise<void>;
        private updateImage;
        getIcon(): controls.IImage;
        layout(): void;
        setInput(input: io.FilePath): void;
    }
}
declare namespace phasereditor2d.images.ui.viewers {
    import controls = colibri.ui.controls;
    import core = colibri.core;
    class ImageFileCellRenderer extends controls.viewers.ImageCellRenderer {
        getLabel(file: core.io.FilePath): string;
        getImage(file: core.io.FilePath): controls.IImage;
    }
}
//# sourceMappingURL=plugin.d.ts.map