declare namespace phasereditor2d.ide {
    import controls = colibri.ui.controls;
    const ICON_PLAY = "play";
    const ICON_MENU = "menu";
    const ICON_THEME = "theme";
    class IDEPlugin extends colibri.Plugin {
        private static _instance;
        private _openingProject;
        static getInstance(): IDEPlugin;
        private constructor();
        registerExtensions(reg: colibri.ExtensionRegistry): void;
        openFirstWindow(): Promise<void>;
        ideOpenProject(projectName: string): Promise<void>;
        private validateIndexFile;
        isOpeningProject(): boolean;
        setTheme(theme: controls.Theme): void;
        restoreTheme(): void;
    }
    const VER = "3.0.0";
}
declare namespace phasereditor2d.ide.ui {
    import ide = colibri.ui.ide;
    class DesignWindow extends ide.WorkbenchWindow {
        static ID: string;
        private _outlineView;
        private _filesView;
        private _inspectorView;
        private _blocksView;
        private _editorArea;
        private _split_Files_Blocks;
        private _split_Editor_FilesBlocks;
        private _split_Outline_EditorFilesBlocks;
        private _split_OutlineEditorFilesBlocks_Inspector;
        constructor();
        saveWindowState(): void;
        saveState(prefs: colibri.core.preferences.Preferences): void;
        restoreState(prefs: colibri.core.preferences.Preferences): void;
        createParts(): void;
        private initToolbar;
        getEditorArea(): ide.EditorArea;
        private initialLayout;
    }
}
declare namespace phasereditor2d.ide.ui {
    class WelcomeWindow extends colibri.ui.ide.WorkbenchWindow {
        static ID: string;
        constructor();
        getEditorArea(): colibri.ui.ide.EditorArea;
        protected createParts(): Promise<void>;
    }
}
declare namespace phasereditor2d.ide.ui.actions {
    const CMD_OPEN_PROJECTS_DIALOG = "phasereditor2d.ide.ui.actions.OpenProjectsDialog";
    const CMD_RELOAD_PROJECT = "phasereditor2d.ide.ui.actions.ReloadProjectAction";
    const CMD_SWITCH_THEME = "phasereditor2d.ide.ui.actions.SwitchTheme";
    const CMD_EDITOR_TABS_SIZE_UP = "phasereditor2d.ide.ui.actions.EditorTabsSizeUp";
    const CMD_EDITOR_TABS_SIZE_DOWN = "phasereditor2d.ide.ui.actions.EditorTabsSizeDown";
    import commands = colibri.ui.ide.commands;
    class IDEActions {
        static registerCommands(manager: commands.CommandManager): void;
    }
}
declare namespace phasereditor2d.ide.ui.actions {
    import controls = colibri.ui.controls;
    class OpenMainMenuAction extends controls.Action {
        constructor();
        run(e: MouseEvent): void;
    }
}
declare namespace phasereditor2d.ide.ui.actions {
    import controls = colibri.ui.controls;
    class OpenProjectsDialogAction extends controls.Action {
        constructor();
        run(): void;
    }
}
declare namespace phasereditor2d.ide.ui.actions {
    import controls = colibri.ui.controls;
    class OpenThemeDialogAction extends controls.Action {
        constructor();
        run(): void;
        static commandTest(args: colibri.ui.ide.commands.CommandArgs): boolean;
    }
}
declare namespace phasereditor2d.ide.ui.actions {
    import controls = colibri.ui.controls;
    class PlayProjectAction extends controls.Action {
        constructor();
        run(): void;
    }
}
declare namespace phasereditor2d.ide.ui.actions {
    import controls = colibri.ui.controls;
    class ReloadProjectAction extends controls.Action {
        constructor();
        run(): void;
    }
}
declare namespace phasereditor2d.ide.ui.dialogs {
    import controls = colibri.ui.controls;
    class AboutDialog extends controls.dialogs.Dialog {
        constructor();
        createDialogArea(): void;
        create(): void;
    }
}
declare namespace phasereditor2d.ide.ui.dialogs {
    import controls = colibri.ui.controls;
    class NewProjectDialog extends controls.dialogs.Dialog {
        protected _filteredViewer: controls.viewers.FilteredViewerInElement<controls.viewers.TreeViewer>;
        protected _projectNameText: HTMLInputElement;
        private _createBtn;
        private _projectNames;
        private _cancellable;
        constructor();
        setCancellable(cancellable: boolean): void;
        protected createDialogArea(): void;
        private createBottomArea;
        private setInitialProjectName;
        private validate;
        private requestProjectsData;
        create(): void;
        private createProject;
        private createCenterArea;
        private createFilteredViewer;
        layout(): void;
    }
}
declare namespace phasereditor2d.ide.ui.dialogs {
    import controls = colibri.ui.controls;
    class OpeningProjectDialog extends controls.dialogs.ProgressDialog {
        create(): void;
    }
}
declare namespace phasereditor2d.ide.ui.dialogs {
    import controls = colibri.ui.controls;
    class ProjectsDialog extends controls.dialogs.ViewerDialog {
        constructor();
        create(): Promise<void>;
        private openProject;
        private openNewProjectDialog;
    }
}
declare namespace phasereditor2d.ide.ui.dialogs {
    import controls = colibri.ui.controls;
    class ThemesDialog extends controls.dialogs.ViewerDialog {
        constructor();
        create(): void;
    }
}
declare namespace phasereditor2d.ide.ui.viewers {
    import controls = colibri.ui.controls;
    class ProjectCellRendererProvider implements controls.viewers.ICellRendererProvider {
        getCellRenderer(element: any): controls.viewers.ICellRenderer;
        preload(element: any): Promise<controls.PreloadResult>;
    }
}
//# sourceMappingURL=plugin.d.ts.map