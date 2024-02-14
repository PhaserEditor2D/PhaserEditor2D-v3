var phasereditor2d;
(function (phasereditor2d) {
    var outline;
    (function (outline) {
        class OutlinePlugin extends colibri.Plugin {
            static _instance = new OutlinePlugin();
            static getInstance() {
                return this._instance;
            }
            constructor() {
                super("phasereditor2d.outline");
            }
        }
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
                    static EDITOR_VIEWER_PROVIDER_KEY = "Outline";
                    constructor() {
                        super("OutlineView");
                        this.setTitle("Outline");
                        this.setIcon(phasereditor2d.resources.getIcon(phasereditor2d.resources.ICON_OUTLINE));
                    }
                    getViewerProvider(editor) {
                        return editor.getEditorViewerProvider(OutlineView.EDITOR_VIEWER_PROVIDER_KEY);
                    }
                }
                views.OutlineView = OutlineView;
            })(views = ui.views || (ui.views = {}));
        })(ui = outline.ui || (outline.ui = {}));
    })(outline = phasereditor2d.outline || (phasereditor2d.outline = {}));
})(phasereditor2d || (phasereditor2d = {}));
