namespace phasereditor2d.scene.ui.editor.usercomponent {

    import controls = colibri.ui.controls;

    export const CMD_ADD_USER_COMPONENT = "phasereditor2d.scene.ui.editor.usercomponent.AddUserComponent";
    export const CMD_COMPILE_FILE = "phasereditor2d.scene.ui.editor.usercomponent.CompileFile";
    export const CMD_QUICK_EDIT_COMPONENT_FILE = "phasereditor2d.scene.ui.editor.usercomponent.QuickEditComponentFile";
    export const CMD_OPEN_COMPONENT_OUTPUT_FILE_IN_VSCODE = "phasereditor2d.scene.ui.editor.usercomponent.OpenComponentOutputFileInVSCode";
    export const CMD_OPEN_COMPONENT_OUTPUT_FILE = "phasereditor2d.scene.ui.editor.usercomponent.OpenComponentOutputFile";
    export const CAT_USER_COMPONENTS_EDITOR = "phasereditor2d.scene.ui.editor.usercomponent.UserComponentsCategory";

    export declare type ISelectionItemID = { component: string, property?: string };

    export class UserComponentsEditor extends colibri.ui.ide.ViewerFileEditor {

        static _factory: colibri.ui.ide.ContentTypeEditorFactory;
        static ID: "phasereditor2d.scene.ui.editor.UserComponentsEditor";
        private _createdPart: boolean;
        private _revealCompName: string;
        private _outputFileEditorStateMap: any = {};

        static getFactory() {

            return this._factory || (this._factory = new colibri.ui.ide.ContentTypeEditorFactory("User Components Editor",
                core.CONTENT_TYPE_USER_COMPONENTS, () => new UserComponentsEditor()
            ));
        }

        static registerCommands(manager: colibri.ui.ide.commands.CommandManager) {

            const editorScope = (args: colibri.ui.ide.commands.HandlerArgs) => {

                return args.activePart instanceof UserComponentsEditor ||
                    (args.activeEditor instanceof UserComponentsEditor &&
                        (args.activePart instanceof phasereditor2d.outline.ui.views.OutlineView
                            || args.activePart instanceof colibri.inspector.ui.views.InspectorView));

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
                    key: "KeyA"
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

            manager.add({
                command: {
                    id: CMD_OPEN_COMPONENT_OUTPUT_FILE,
                    icon: resources.getIcon(resources.ICON_FILE_SCRIPT),
                    name: "Open Component Output File",
                    tooltip: "Open the output source file of the selected component.",
                    category: CAT_USER_COMPONENTS_EDITOR
                },
                handler: {
                    testFunc: args => {

                        if (args.activeEditor instanceof UserComponentsEditor) {

                            return args.activeEditor.getSelectedComponents().length === 1;
                        }

                        return false;
                    },
                    executeFunc: args => {

                        const editor = args.activeEditor as UserComponentsEditor;

                        const compiler = new UserComponentCompiler(editor.getInput(), editor.getModel());

                        const component = editor.getSelectedComponents()[0];

                        const file = compiler.getOutputFile(component.getName());

                        colibri.Platform.getWorkbench().openEditor(file);
                    }
                }
            });

            manager.add({
                command: {
                    id: CMD_QUICK_EDIT_COMPONENT_FILE,
                    name: "Quick Edit Component Source File",
                    category: CAT_USER_COMPONENTS_EDITOR,
                    tooltip: "Open output component file in a popup editor."
                },
                handler: {
                    testFunc: args => editorScope(args) && (args.activeEditor as UserComponentsEditor).getSelectedComponents().length === 1,
                    executeFunc: args => {

                        (args.activeEditor as UserComponentsEditor).openOutputFileQuickEditorDialog();
                    }
                },
                keys: {
                    key: "KeyQ"
                }
            });

            if (ide.IDEPlugin.getInstance().isDesktopMode()) {

                const editorName = ide.IDEPlugin.getInstance().getExternalEditorName();

                manager.add({
                    command: {
                        id: CMD_OPEN_COMPONENT_OUTPUT_FILE_IN_VSCODE,
                        name: "Open Component Output File in " + editorName,
                        category: CAT_USER_COMPONENTS_EDITOR,
                        tooltip: "Open the compiler output file in the configured external editor (" + editorName + ")"
                    },
                    handler: {
                        testFunc: args => {

                            if (args.activeEditor instanceof UserComponentsEditor) {

                                return args.activeEditor.getSelectedComponents().length === 1;
                            }

                            return false;
                        },
                        executeFunc: args => {

                            const editor = args.activeEditor as UserComponentsEditor;

                            const compiler = new UserComponentCompiler(editor.getInput(), editor.getModel());

                            const component = editor.getSelectedComponents()[0] as UserComponent;

                            const file = compiler.getOutputFile(component.getName());

                            if (file) {

                                ide.IDEPlugin.getInstance().openFileExternalEditor(file);

                            } else {

                                alert(`Output from "${component.getName()}" not found.`);
                            }
                        }
                    },
                    keys: {
                        control: true,
                        alt: true,
                        key: "KeyE"
                    }
                });
            }
        }

        private _model: UserComponentsModel;
        private _outlineProvider: UserComponentsEditorOutlineProvider;
        private _propertyProvider: UserComponentsEditorPropertySectionProvider;

        constructor() {
            super(UserComponentsEditor.ID, UserComponentsEditor.getFactory());

            this._model = new UserComponentsModel();
            this._outlineProvider = new UserComponentsEditorOutlineProvider(this);
            this._propertyProvider = new UserComponentsEditorPropertySectionProvider(this);
        }

        getSelectionDataFromObjects(selection: any[]): ISelectionItemID[] {

            const result = selection.map(obj => {

                if (obj instanceof UserComponent) {

                    return { component: obj.getName() }
                }

                if (obj instanceof sceneobjects.UserProperty) {

                    const comp = (obj.getManager() as UserComponentProperties).getUserComponent();

                    return {
                        component: comp.getName(),
                        property: obj.getName()
                    };
                }
            });

            return result;
        }

        getSelectionFromData(selectionData: ISelectionItemID[]) {

            const selection = selectionData.map(item => {

                const comp = this._model.getComponents().find(comp => comp.getName() === item.component);

                if (comp && item.property) {

                    return comp.getUserProperties().getProperties().find(prop => prop.getName() === item.property);
                }

                return comp;

            }).filter(obj => obj !== undefined);

            return selection;
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

            const resourceMenu = new controls.Menu("Resources");

            for (const mod of [false, true]) {

                for (const ext of ["js", "ts"]) {

                    resourceMenu.addAction({
                        text: `Create UserComponent.${ext}${mod ? " (ES Module)" : ""}`,
                        icon: resources.getIcon(resources.ICON_FILE_SCRIPT),
                        callback: async () => {

                            const codeResources = UserComponentCodeResources.getInstance();
                            // const id = "UserComponent" + (mod ? ".module" : "") + "." + ext;
                            const id = `${ext}${mod? "-module" : ""}/UserComponent.${ext}`;
                            const parent = this.getInput().getParent();
                            const name = "UserComponent." + ext

                            if (parent.getFile(name)) {

                                if (!confirm("The file already exists, do you want to overwrite it?")) {

                                    return;
                                }
                            }

                            const file = await codeResources.createFile(id, parent, name);

                            colibri.Platform.getWorkbench().openEditor(file);
                        }
                    });
                }
            }

            menu.addMenu(resourceMenu);

            const compilerMenu = new controls.Menu("Compiler");

            compilerMenu.addCommand(CMD_COMPILE_FILE);

            compilerMenu.addSeparator();

            compilerMenu.addCommand(CMD_OPEN_COMPONENT_OUTPUT_FILE);

            compilerMenu.addCommand(CMD_QUICK_EDIT_COMPONENT_FILE);

            compilerMenu.addCommand(CMD_OPEN_COMPONENT_OUTPUT_FILE_IN_VSCODE);

            menu.addMenu(compilerMenu);
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

        openOutputFileQuickEditorDialog() {

            const component = this.getSelectedComponents()[0];

            const fileName = component.getName() + "." + (this._model.getOutputLang() === ide.core.code.SourceLang.JAVA_SCRIPT ? "js" : "ts");

            const file = this.getInput().getSibling(fileName);

            if (!file) {

                return;
            }

            const state = this._outputFileEditorStateMap[fileName] || {};

            const dlg = new colibri.ui.ide.QuickEditorDialog(file, state);

            dlg.create();

            dlg.addButton("Play", () => {

                colibri.Platform.getWorkbench().getCommandManager()
                    .executeCommand(ide.ui.actions.CMD_PLAY_PROJECT);
            });

            dlg.eventDialogClose.addListener(() => {

                this._outputFileEditorStateMap[fileName] = dlg.getEditorState();

                colibri.Platform.getWorkbench().setActiveEditor(this);
            });
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

                this.refreshViewers();
            }
        }

        refreshViewers() {

            this.getViewer().repaint();
            this._outlineProvider.repaint();
        }

        deleteSelection() {

            const before = UserComponentsEditorSnapshotOperation.takeSnapshot(this);

            const deleteComponentsSet = new Set();

            for (const obj of this.getViewer().getSelection()) {

                if (obj instanceof UserComponent) {

                    deleteComponentsSet.add(obj);

                } else if (obj instanceof sceneobjects.UserProperty) {

                    obj.getManager().deleteProperty(obj.getName());

                } else if (typeof obj === "string") {

                    for (const obj2 of this._model.getComponents()) {

                        if (obj2.getGameObjectType() === obj) {

                            deleteComponentsSet.add(obj2);
                        }
                    }
                }
            }

            this._model.setComponents(
                this._model.getComponents().filter(comp => !deleteComponentsSet.has(comp))
            );

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

            const viewer = new controls.viewers.TreeViewer("phasereditor2d.scene.ui.editor.usercomponent.UserComponentsEditor");

            viewer.setLabelProvider(new UserComponentSignatureLabelProvider());
            viewer.setStyledLabelProvider(new UserComponentSignatureStyledLabelProvider());
            viewer.setContentProvider(new UserComponentEditorContentProvider());
            viewer.setCellRendererProvider(new controls.viewers.EmptyCellRendererProvider(
                // tslint:disable-next-line:new-parens
                obj => {

                    if (obj instanceof UserComponent) {

                        return new controls.viewers.IconImageCellRenderer(resources.getIcon(resources.ICON_USER_COMPONENT))
                    }

                    return new controls.viewers.IconImageCellRenderer(resources.getIcon(resources.ICON_USER_PROPERTY));
                }
            ));
            // tslint:disable-next-line:new-parens
            viewer.setTreeRenderer(new class extends controls.viewers.TreeViewerRenderer {
                constructor() {
                    super(viewer);
                }

                prepareContextForText(args: controls.viewers.RenderCellArgs) {

                    super.prepareContextForText(args)

                    args.canvasContext.font = controls.getCanvasFontHeight() + "px Monospace";
                }
            });
            viewer.setInput(this._model);

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

            if (obj instanceof UserComponent) {

                return `class ${obj.getName()} (gameObject: ${obj.getGameObjectType()})`;
            }

            if (obj instanceof sceneobjects.UserProperty) {

                return "property " + obj.getLabel() + ": " +
                    (obj.getType() instanceof ui.sceneobjects.ExpressionPropertyType ?
                        (obj.getType() as ui.sceneobjects.ExpressionPropertyType).getExpressionType()
                        : obj.getType().getName());
            }

            return "";
        }
    }

    class UserComponentSignatureStyledLabelProvider implements controls.viewers.IStyledLabelProvider {

        private static colorMap = {
            light: {
                keyword: "blue",
                typeName: "#28809A",
                default: "black"
            },
            dark: {
                keyword: "#569CD6",
                typeName: "#4BC1A9",
                default: "white"
            }
        }

        getStyledTexts(obj: any, dark: boolean): controls.viewers.IStyledText[] {

            const colorMap = UserComponentSignatureStyledLabelProvider.colorMap;

            const colors = dark ? colorMap.dark : colorMap.light;

            if (obj instanceof UserComponent) {

                return [{
                    text: "class ",
                    color: colors.keyword
                }, {
                    text: obj.getName(),
                    color: colors.typeName,
                }, {
                    text: " (gameObject: ",
                    color: colors.default
                }, {
                    text: obj.getGameObjectType(),
                    color: colors.typeName
                },
                {
                    text: ")",
                    color: colors.default
                }]
            }

            if (obj instanceof sceneobjects.UserProperty) {

                const typeName = obj.getType() instanceof ui.sceneobjects.ExpressionPropertyType ?

                    (obj.getType() as ui.sceneobjects.ExpressionPropertyType).getExpressionType()

                    : obj.getType().getName();

                return [{
                    text: "property ",
                    color: colors.keyword
                }, {
                    text: obj.getLabel() + ": ",
                    color: colors.default
                }, {
                    text: typeName,
                    color: colors.typeName
                }];
            }

            return [];
        }
    }
}