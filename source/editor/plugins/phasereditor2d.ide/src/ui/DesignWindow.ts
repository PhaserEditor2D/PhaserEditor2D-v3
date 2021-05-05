namespace phasereditor2d.ide.ui {

    import controls = colibri.ui.controls;
    import ide = colibri.ui.ide;
    import core = colibri.core;

    export class DesignWindow extends ide.WorkbenchWindow {

        static ID = "phasereditor2d.ide.ui.DesignWindow";

        static MENU_MAIN = "phasereditor2d.ide.ui.MainMenu";

        private _outlineView: outline.ui.views.OutlineView;
        private _filesView: files.ui.views.FilesView;
        private _inspectorView: colibri.inspector.ui.views.InspectorView;
        private _blocksView: blocks.ui.views.BlocksView;
        private _problemsView: colibri.problems.ui.views.ProblemsView;
        private _editorArea: ide.EditorArea;
        private _split_Files_Blocks: controls.SplitPanel;
        private _split_Editor_FilesBlocks: controls.SplitPanel;
        private _split_Outline_EditorFilesBlocks: controls.SplitPanel;
        private _split_OutlineEditorFilesBlocks_Inspector: controls.SplitPanel;

        constructor() {
            super(DesignWindow.ID);

            ide.Workbench.getWorkbench().eventPartActivated.addListener(() => {

                this.saveWindowState();
            });

            window.addEventListener("beforeunload", e => {

                this.saveWindowState();
            });
        }

        saveWindowState() {

            if (IDEPlugin.getInstance().isOpeningProject()) {
                return;
            }

            this.saveState(colibri.Platform.getWorkbench().getProjectPreferences());
        }

        saveState(prefs: colibri.core.preferences.Preferences) {

            this.saveEditorsState(prefs);
        }

        restoreState(prefs: colibri.core.preferences.Preferences) {

            this.restoreEditors(prefs);
        }

        createParts() {

            this._outlineView = new outline.ui.views.OutlineView();
            this._filesView = new files.ui.views.FilesView();
            this._inspectorView = new colibri.inspector.ui.views.InspectorView();
            this._blocksView = new blocks.ui.views.BlocksView();
            this._problemsView = new colibri.problems.ui.views.ProblemsView();
            this._editorArea = new ide.EditorArea();

            this._split_Files_Blocks = new controls.SplitPanel(
                this.createViewFolder(this._filesView), this.createViewFolder(this._blocksView, this._problemsView));

            this._split_Editor_FilesBlocks = new controls.SplitPanel(this._editorArea, this._split_Files_Blocks, false);

            this._split_Outline_EditorFilesBlocks = new controls.SplitPanel(
                this.createViewFolder(this._outlineView), this._split_Editor_FilesBlocks);

            this._split_OutlineEditorFilesBlocks_Inspector = new controls.SplitPanel(
                this._split_Outline_EditorFilesBlocks, this.createViewFolder(this._inspectorView));

            this.getClientArea().add(this._split_OutlineEditorFilesBlocks_Inspector);

            this.initToolbar();

            this.initialLayout();
        }

        private initToolbar() {

            const toolbar = this.getToolbar();

            {
                // left area

                const area = toolbar.getLeftArea();

                const manager = new controls.ToolbarManager(area);

                manager.add(new files.ui.actions.OpenNewFileDialogAction());

                // manager.add(new ui.actions.OpenProjectsDialogAction());

                manager.addCommand(actions.CMD_PLAY_PROJECT, { showText: false });
            }

            {
                // right area

                const area = toolbar.getRightArea();

                const manager = new controls.ToolbarManager(area);

                manager.add(new actions.OpenMainMenuAction());
            }
        }

        getEditorArea() {
            return this._editorArea;
        }

        private initialLayout() {

            this._split_Files_Blocks.setSplitFactor(0.2);
            this._split_Editor_FilesBlocks.setSplitFactor(0.6);
            this._split_Outline_EditorFilesBlocks.setSplitFactor(0.15);
            this._split_OutlineEditorFilesBlocks_Inspector.setSplitFactor(0.8);

            this.layout();
        }
    }
}