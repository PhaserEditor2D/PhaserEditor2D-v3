namespace phasereditor2d.scene.ui.editor.scripts {

    import controls = colibri.ui.controls;
    import io = colibri.core.io;

    export const CMD_ADD_SCRIPT_OBJECT = "phasereditor2d.scene.ui.editor.scripts.AddScriptObject";
    export const CAT_OBJECT_SCRIPTS_EDITOR = "phasereditor2d.scene.ui.editor.scripts.AddScriptObject";

    export class ObjectScriptEditor extends colibri.ui.ide.ViewerFileEditor {

        static _factory: colibri.ui.ide.ContentTypeEditorFactory;
        static ID: "phasereditor2d.scene.ui.editor.ObjectScriptEditor";
        
        static getFactory() {

            return this._factory || (this._factory = new colibri.ui.ide.ContentTypeEditorFactory(
                core.CONTENT_TYPE_OBJECT_SCRIPT, () => new ObjectScriptEditor()
            ));
        }

        static registerCommands(manager: colibri.ui.ide.commands.CommandManager) {

            const editorScope = (args: colibri.ui.ide.commands.HandlerArgs) => {

                return args.activePart instanceof ObjectScriptEditor ||
                    (args.activeEditor instanceof ObjectScriptEditor &&
                        (args.activePart instanceof phasereditor2d.outline.ui.views.OutlineView
                            || args.activePart instanceof phasereditor2d.inspector.ui.views.InspectorView));

            };

            manager.addCategory({
                id: CAT_OBJECT_SCRIPTS_EDITOR,
                name: "Object Scripts Editor"
            });

            manager.add({
                command: {
                    id: CMD_ADD_SCRIPT_OBJECT,
                    name: "Add Script",
                    category: CAT_OBJECT_SCRIPTS_EDITOR,
                    tooltip: "Add a new Object Script.",
                    icon: colibri.ColibriPlugin.getInstance().getIcon(colibri.ICON_PLUS)
                },
                handler: {
                    testFunc: editorScope,
                    executeFunc: args => {
                        (args.activeEditor as ObjectScriptEditor).addScriptObject();
                    }
                }
            })
        }

        private _model: ObjectScriptEditorModel;
        private _outlineProvider: ObjectScriptsEditorOutlineProvider;
        private _propertyProvider: ObjectScriptEditorPropertySectionProvider;

        constructor() {
            super(ObjectScriptEditor.ID);

            this._model = new ObjectScriptEditorModel();
            this._outlineProvider = new ObjectScriptsEditorOutlineProvider(this);
            this._propertyProvider = new ObjectScriptEditorPropertySectionProvider();
        }

        protected onEditorInputContentChanged() {
            // TODO
        }

        addScriptObject() {

            const script = new ObjectScript("NewScript");

            this._model.getScripts().push(script);

            this.getViewer().setSelection([script]);
            this.getViewer().reveal(script);
        }

        setInput(file: io.FilePath) {

            super.setInput(file);

            // TODO: read the model

            if (this.getViewer()) {

                this.getViewer().setInput(this._model.getScripts());
            }
        }

        protected createViewer(): controls.viewers.TreeViewer {

            const viewer = new controls.viewers.TreeViewer();

            viewer.setLabelProvider(new controls.viewers.LabelProvider((obj: ObjectScript) => obj.getName()));
            viewer.setContentProvider(new controls.viewers.ArrayTreeContentProvider());
            viewer.setCellRendererProvider(new controls.viewers.EmptyCellRendererProvider(
                obj => new controls.viewers.IconImageCellRenderer(ScenePlugin.getInstance().getIcon(ICON_OBJECT_SCRIPT))
            ));
            viewer.setTreeRenderer(new controls.viewers.TreeViewerRenderer(viewer));
            viewer.setInput(this._model.getScripts());

            viewer.eventSelectionChanged.addListener(() => {

                this._outlineProvider.setSelection(viewer.getSelection(), true, false);

                this._outlineProvider.repaint();
            });

            return viewer;
        }

        getEditorViewerProvider(key: string) {

            switch (key) {

                case phasereditor2d.outline.ui.views.OutlineView.EDITOR_VIEWER_PROVIDER_KEY:

                    return this._outlineProvider;

                default:
                    break;
            }
        }

        getPropertyProvider() {

            return this._propertyProvider;
        }

        createEditorToolbar(parent: HTMLElement) {

            const manager = new controls.ToolbarManager(parent);

            manager.addCommand(CMD_ADD_SCRIPT_OBJECT, {
                showText: true
            });

            return manager;
        }
    }
}