var phasereditor2d;
(function (phasereditor2d) {
    var outline;
    (function (outline) {
        var ide = colibri.ui.ide;
        outline.ICON_OUTLINE = "outline";
        class OutlinePlugin extends colibri.Plugin {
            constructor() {
                super("phasereditor2d.outline");
            }
            static getInstance() {
                return this._instance;
            }
            registerExtensions(reg) {
                reg.addExtension(ide.IconLoaderExtension.withPluginFiles(this, [
                    outline.ICON_OUTLINE
                ]));
            }
        }
        OutlinePlugin._instance = new OutlinePlugin();
        outline.OutlinePlugin = OutlinePlugin;
        colibri.Platform.addPlugin(OutlinePlugin.getInstance());
    })(outline = phasereditor2d.outline || (phasereditor2d.outline = {}));
})(phasereditor2d || (phasereditor2d = {}));
var phasereditor2d;
(function (phasereditor2d) {
    var outline;
    (function (outline) {
        var ui;
        (function (ui) {
            var views;
            (function (views) {
                var ide = colibri.ui.ide;
                class OutlineView extends ide.EditorViewerView {
                    constructor() {
                        super("OutlineView");
                        this.setTitle("Outline");
                        this.setIcon(outline.OutlinePlugin.getInstance().getIcon(outline.ICON_OUTLINE));
                    }
                    getViewerProvider(editor) {
                        return editor.getEditorViewerProvider(OutlineView.EDITOR_VIEWER_PROVIDER_KEY);
                    }
                }
                OutlineView.EDITOR_VIEWER_PROVIDER_KEY = "Outline";
                views.OutlineView = OutlineView;
            })(views = ui.views || (ui.views = {}));
        })(ui = outline.ui || (outline.ui = {}));
    })(outline = phasereditor2d.outline || (phasereditor2d.outline = {}));
})(phasereditor2d || (phasereditor2d = {}));
