var phasereditor2d;
(function (phasereditor2d) {
    var images;
    (function (images) {
        var ide = colibri.ui.ide;
        class ImagesPlugin extends colibri.Plugin {
            constructor() {
                super("phasereditor2d.images");
            }
            static getInstance() {
                return this._instance;
            }
            registerExtensions(reg) {
                // file cell renderers
                reg
                    .addExtension(new phasereditor2d.files.ui.viewers.SimpleContentTypeCellRendererExtension(phasereditor2d.webContentTypes.core.CONTENT_TYPE_IMAGE, new images.ui.viewers.ImageFileCellRenderer()));
                reg
                    .addExtension(new phasereditor2d.files.ui.viewers.SimpleContentTypeCellRendererExtension(phasereditor2d.webContentTypes.core.CONTENT_TYPE_SVG, new images.ui.viewers.ImageFileCellRenderer()));
                // editors
                reg.addExtension(new ide.EditorExtension([images.ui.editors.ImageEditor.getFactory()]));
            }
        }
        ImagesPlugin._instance = new ImagesPlugin();
        images.ImagesPlugin = ImagesPlugin;
        colibri.Platform.addPlugin(ImagesPlugin.getInstance());
    })(images = phasereditor2d.images || (phasereditor2d.images = {}));
})(phasereditor2d || (phasereditor2d = {}));
var phasereditor2d;
(function (phasereditor2d) {
    var images;
    (function (images) {
        var ui;
        (function (ui) {
            var editors;
            (function (editors) {
                var ide = colibri.ui.ide;
                var controls = colibri.ui.controls;
                var io = colibri.core.io;
                class ImageEditorFactory extends ide.EditorFactory {
                    constructor() {
                        super("phasereditor2d.ImageEditorFactory");
                    }
                    acceptInput(input) {
                        if (input instanceof io.FilePath) {
                            const file = input;
                            const contentType = ide.Workbench.getWorkbench().getContentTypeRegistry().getCachedContentType(file);
                            if (contentType === phasereditor2d.webContentTypes.core.CONTENT_TYPE_IMAGE) {
                                return true;
                            }
                        }
                        return false;
                    }
                    createEditor() {
                        return new ImageEditor();
                    }
                }
                class ImageEditor extends ide.FileEditor {
                    constructor() {
                        super("phasereditor2d.ImageEditor");
                        this.addClass("ImageEditor");
                    }
                    static getFactory() {
                        return new ImageEditorFactory();
                    }
                    onEditorInputContentChanged() {
                    }
                    async createPart() {
                        this._imageControl = new controls.ImageControl();
                        const container = document.createElement("div");
                        container.classList.add("ImageEditorContainer");
                        container.appendChild(this._imageControl.getElement());
                        this.getElement().appendChild(container);
                        this.updateImage();
                    }
                    async updateImage() {
                        const file = this.getInput();
                        if (!file) {
                            return;
                        }
                        const img = ide.Workbench.getWorkbench().getFileImage(file);
                        this._imageControl.setImage(img);
                        this._imageControl.repaint();
                        const result = await img.preload();
                        if (result === controls.PreloadResult.RESOURCES_LOADED) {
                            this._imageControl.repaint();
                        }
                        this.dispatchTitleUpdatedEvent();
                    }
                    getIcon() {
                        const file = this.getInput();
                        if (!file) {
                            return super.getIcon();
                        }
                        const img = ide.Workbench.getWorkbench().getFileImage(file);
                        return img;
                    }
                    layout() {
                        if (this._imageControl) {
                            this._imageControl.resizeTo();
                        }
                    }
                    setInput(input) {
                        super.setInput(input);
                        if (this._imageControl) {
                            this.updateImage();
                        }
                    }
                }
                editors.ImageEditor = ImageEditor;
            })(editors = ui.editors || (ui.editors = {}));
        })(ui = images.ui || (images.ui = {}));
    })(images = phasereditor2d.images || (phasereditor2d.images = {}));
})(phasereditor2d || (phasereditor2d = {}));
var phasereditor2d;
(function (phasereditor2d) {
    var images;
    (function (images) {
        var ui;
        (function (ui) {
            var viewers;
            (function (viewers) {
                var controls = colibri.ui.controls;
                var ide = colibri.ui.ide;
                class ImageFileCellRenderer extends controls.viewers.ImageCellRenderer {
                    getLabel(file) {
                        return file.getName();
                    }
                    getImage(file) {
                        return ide.Workbench.getWorkbench().getFileImage(file);
                    }
                }
                viewers.ImageFileCellRenderer = ImageFileCellRenderer;
            })(viewers = ui.viewers || (ui.viewers = {}));
        })(ui = images.ui || (images.ui = {}));
    })(images = phasereditor2d.images || (phasereditor2d.images = {}));
})(phasereditor2d || (phasereditor2d = {}));
