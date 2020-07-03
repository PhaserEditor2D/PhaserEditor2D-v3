namespace phasereditor2d.scene.ui.editor.usercomponent {

    import controls = colibri.ui.controls;

    export const CMD_ADD_USER_COMPONENT = "phasereditor2d.scene.ui.editor.usercomponent.AddUserComponent";
    export const CAT_USER_COMPONENTS_EDITOR = "phasereditor2d.scene.ui.editor.usercomponent.UserComponentsCategory";

    export class UserComponentsEditor extends colibri.ui.ide.ViewerFileEditor {

        static _factory: colibri.ui.ide.ContentTypeEditorFactory;
        static ID: "phasereditor2d.scene.ui.editor.UserComponentsEditor";

        static getFactory() {

            return this._factory || (this._factory = new colibri.ui.ide.ContentTypeEditorFactory(
                core.CONTENT_TYPE_USER_COMPONENTS, () => new UserComponentsEditor()
            ));
        }

        static registerCommands(manager: colibri.ui.ide.commands.CommandManager) {

            const editorScope = (args: colibri.ui.ide.commands.HandlerArgs) => {

                return args.activePart instanceof UserComponentsEditor ||
                    (args.activeEditor instanceof UserComponentsEditor &&
                        (args.activePart instanceof phasereditor2d.outline.ui.views.OutlineView
                            || args.activePart instanceof phasereditor2d.inspector.ui.views.InspectorView));

            };

            manager.addCategory({
                id: CAT_USER_COMPONENTS_EDITOR,
                name: "User Components Editor"
            });

            manager.add({
                command: {
                    id: CMD_ADD_USER_COMPONENT,
                    name: "Add User Component",
                    category: CAT_USER_COMPONENTS_EDITOR,
                    tooltip: "Add a new User Component.",
                    icon: colibri.ColibriPlugin.getInstance().getIcon(colibri.ICON_PLUS)
                },
                handler: {
                    testFunc: editorScope,
                    executeFunc: args => {
                        (args.activeEditor as UserComponentsEditor).addComponent();
                    }
                }
            })
        }

        private _model: UserComponentsEditorModel;
        private _outlineProvider: UserComponentsEditorOutlineProvider;
        private _propertyProvider: UserComponentsEditorPropertySectionProvider;

        constructor() {
            super(UserComponentsEditor.ID);

            this._model = new UserComponentsEditorModel();
            this._outlineProvider = new UserComponentsEditorOutlineProvider(this);
            this._propertyProvider = new UserComponentsEditorPropertySectionProvider();
        }

        getModel() {

            return this._model;
        }

        protected onEditorInputContentChanged() {

            this.updateContent();
        }

        createPart() {

            super.createPart();

            this.updateContent();
        }

        async doSave() {

            const content = JSON.stringify(this._model.toJSON(), null, 4);

            try {

                await colibri.ui.ide.FileUtils.setFileString_async(this.getInput(), content);

                this.setDirty(false);

            } catch (e) {

                console.error(e);
            }
        }

        private async updateContent() {

            const content = await colibri.ui.ide.FileUtils.preloadAndGetFileString(this.getInput());

            const data = JSON.parse(content);

            this._model.readJSON(data);

            if (this.getViewer()) {

                this.getViewer().setInput(this._model.getComponents());
                this.getViewer().repaint();
            }
        }

        addComponent() {

            const before = UserComponentsEditorSnapshotOperation.takeSnapshot(this);

            const maker = new colibri.ui.ide.utils.NameMaker((comp: UserComponent) => comp.getName());
            maker.update(this._model.getComponents());
            const name = maker.makeName("Component");

            const userComp = new UserComponent(name);

            this._model.getComponents().push(userComp);
            this.getViewer().setSelection([userComp]);
            this.getViewer().reveal(userComp);
            this.setDirty(true);

            const after = UserComponentsEditorSnapshotOperation.takeSnapshot(this);

            this.getUndoManager().add(new UserComponentsEditorSnapshotOperation(this, before, after));
        }

        protected createViewer(): controls.viewers.TreeViewer {

            const viewer = new controls.viewers.TreeViewer();

            viewer.setLabelProvider(new controls.viewers.LabelProvider((obj: UserComponent) => obj.getName()));
            viewer.setContentProvider(new controls.viewers.ArrayTreeContentProvider());
            viewer.setCellRendererProvider(new controls.viewers.EmptyCellRendererProvider(
                obj => new controls.viewers.IconImageCellRenderer(ScenePlugin.getInstance().getIcon(ICON_USER_COMPONENT))
            ));
            viewer.setTreeRenderer(new controls.viewers.TreeViewerRenderer(viewer));
            viewer.setInput([]);

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

            manager.addCommand(CMD_ADD_USER_COMPONENT, {
                showText: true
            });

            return manager;
        }
    }
}