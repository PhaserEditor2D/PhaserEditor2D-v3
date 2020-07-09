namespace phasereditor2d.scene.ui.editor.usercomponent {

    import controls = colibri.ui.controls;

    export const CMD_ADD_USER_COMPONENT = "phasereditor2d.scene.ui.editor.usercomponent.AddUserComponent";
    export const CMD_COMPILE_FILE = "phasereditor2d.scene.ui.editor.usercomponent.CompileFile";
    export const CAT_USER_COMPONENTS_EDITOR = "phasereditor2d.scene.ui.editor.usercomponent.UserComponentsCategory";

    export class UserComponentsEditor extends colibri.ui.ide.ViewerFileEditor {

        static _factory: colibri.ui.ide.ContentTypeEditorFactory;
        static ID: "phasereditor2d.scene.ui.editor.UserComponentsEditor";
        private _createdPart: boolean;
        private _revealCompName: string;

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
                },
                keys: {
                    key: "A"
                }
            });

            manager.add({
                command: {
                    id: CMD_COMPILE_FILE,
                    name: "Compile",
                    tooltip: "Compile User Components file.",
                    category: CAT_USER_COMPONENTS_EDITOR
                },
                handler: {
                    testFunc: editorScope,
                    executeFunc: args => (args.activeEditor as UserComponentsEditor).compile()
                }
            });

            manager.add({
                handler: {
                    testFunc: args => editorScope(args) && args.activeEditor.getSelection().length > 0,
                    executeFunc: args => {
                        (args.activeEditor as UserComponentsEditor).deleteSelection();
                    }
                }
            }, colibri.ui.ide.actions.CMD_DELETE);
        }

        private _model: UserComponentsModel;
        private _outlineProvider: UserComponentsEditorOutlineProvider;
        private _propertyProvider: UserComponentsEditorPropertySectionProvider;

        constructor() {
            super(UserComponentsEditor.ID);

            this._model = new UserComponentsModel();
            this._outlineProvider = new UserComponentsEditorOutlineProvider(this);
            this._propertyProvider = new UserComponentsEditorPropertySectionProvider(this);
        }

        getSelectedComponents(): UserComponent[] {

            return this.getViewer().getSelection().filter(o => o instanceof UserComponent);
        }

        getModel() {

            return this._model;
        }

        revealComponent(compName: string) {

            if (!this._createdPart) {

                this._revealCompName = compName;

            } else {

                this.revealComponentNow(compName);
            }
        }

        private revealComponentNow(compName: string) {

            const comp = this._model.getComponents().find(c => c.getName() === compName);

            if (comp) {

                this.getViewer().setSelection([comp]);
                this.getViewer().reveal(comp);
            }
        }

        protected async onEditorInputContentChangedByExternalEditor() {

            const sel = new Set(this.getViewer().getSelection().map(c => c.getName()));

            await this.updateContent();

            this.getViewer().setSelection(this._model.getComponents().filter(c => sel.has(c.getName())));
            this.getViewer().repaint();
        }

        async createPart() {

            super.createPart();

            await this.updateContent();

            this._createdPart = true;

            if (this._revealCompName) {

                this.revealComponentNow(this._revealCompName);

            } else {

                this.getViewer().setSelection([]);
            }
        }

        fillContextMenu(menu: controls.Menu) {

            menu.addCommand(CMD_ADD_USER_COMPONENT, {
                text: "Add Component"
            });

            menu.addCommand(colibri.ui.ide.actions.CMD_DELETE);

            menu.addSeparator();

            menu.addCommand(CMD_COMPILE_FILE);
        }

        async doSave() {

            const content = JSON.stringify(this._model.toJSON(), null, 4);

            try {

                await colibri.ui.ide.FileUtils.setFileString_async(this.getInput(), content);

                this.setDirty(false);

                this.compile();

            } catch (e) {

                console.error(e);
            }
        }

        async compile() {

            const compiler = new UserComponentCompiler(this.getInput(), this._model);

            await compiler.compile();
        }

        private async updateContent() {

            const content = await colibri.ui.ide.FileUtils.preloadAndGetFileString(this.getInput());

            const data = JSON.parse(content);

            this._model.readJSON(data);

            if (this.getViewer()) {

                this.getViewer().setInput(this._model.getComponents());
                this.refreshViewers();
            }
        }

        refreshViewers() {

            this.getViewer().repaint();
            this._outlineProvider.repaint();
        }

        deleteSelection() {

            const before = UserComponentsEditorSnapshotOperation.takeSnapshot(this);

            const deleteSet = new Set();

            for (const obj of this.getViewer().getSelection()) {

                if (obj instanceof UserComponent) {

                    deleteSet.add(obj);

                } else {

                    for (const obj2 of this._model.getComponents()) {

                        if (obj2.getGameObjectType() === obj) {

                            deleteSet.add(obj2);
                        }
                    }
                }
            }

            this._model.setComponents(
                this._model.getComponents().filter(comp => !deleteSet.has(comp))
            );

            this.getViewer().setInput(this._model.getComponents());
            this.getViewer().setSelection([]);
            this.setDirty(true);

            const after = UserComponentsEditorSnapshotOperation.takeSnapshot(this);

            this.getUndoManager().add(new UserComponentsEditorSnapshotOperation(this, before, after));
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

        protected createFilteredViewer(viewer: controls.viewers.TreeViewer): controls.viewers.FilteredViewer<any> {

            return new controls.viewers.FilteredViewer(viewer, false);
        }

        protected createViewer(): controls.viewers.TreeViewer {

            const viewer = new controls.viewers.TreeViewer();

            viewer.setLabelProvider(new UserComponentSignatureLabelProvider());
            viewer.setContentProvider(new controls.viewers.ArrayTreeContentProvider());
            viewer.setCellRendererProvider(new controls.viewers.EmptyCellRendererProvider(
                // tslint:disable-next-line:new-parens
                obj => new controls.viewers.IconImageCellRenderer(ScenePlugin.getInstance().getIcon(ICON_USER_COMPONENT))
            ));
            // tslint:disable-next-line:new-parens
            viewer.setTreeRenderer(new class extends controls.viewers.TreeViewerRenderer {
                constructor() {
                    super(viewer);
                }

                prepareContextForText(args: controls.viewers.RenderCellArgs) {

                    super.prepareContextForText(args)

                    args.canvasContext.font = controls.FONT_HEIGHT + "px Monospace";
                }
            });
            viewer.setInput([]);

            viewer.eventSelectionChanged.addListener(() => {

                this._outlineProvider.setSelection(viewer.getSelection(), true, false);

                this._outlineProvider.repaint();
            });

            viewer.eventOpenItem.addListener((elem: UserComponent) => {

                const compiler = new UserComponentCompiler(this.getInput(), this._model);

                const file = compiler.getOutputFile(elem.getName());

                colibri.Platform.getWorkbench().openEditor(file);
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
                showText: true,
                text: "Add Component"
            });

            return manager;
        }

        runOperation(action: (model?: UserComponentsModel) => void) {

            const before = UserComponentsEditorSnapshotOperation.takeSnapshot(this);

            action(this._model);

            const after = UserComponentsEditorSnapshotOperation.takeSnapshot(this);

            this.getUndoManager().add(new UserComponentsEditorSnapshotOperation(this, before, after));

            this.setDirty(true);
            this.refreshViewers();
        }
    }

    class UserComponentSignatureLabelProvider implements controls.viewers.ILabelProvider {

        getLabel(obj: any): string {

            const comp = obj as UserComponent;

            const body = comp.getUserProperties().getProperties()
                .map(p => p.getName() + ":" +
                    (p.getType() instanceof ui.sceneobjects.ExpressionPropertyType ?
                        (p.getType() as ui.sceneobjects.ExpressionPropertyType).getExpressionType()
                        : p.getType().getName()))
                .join(", ")

            return comp.getName() + " (gameObject) { " + body + " }";
        }

    }
}