declare namespace phasereditor2d.ide {
    import controls = colibri.ui.controls;
    const ICON_PLAY = "play";
    const ICON_MENU = "menu";
    const ICON_THEME = "theme";
    class IDEPlugin extends colibri.Plugin {
        private static _instance;
        private _openingProject;
        private _desktopMode;
        private _advancedJSEditor;
        static getInstance(): IDEPlugin;
        private constructor();
        registerExtensions(reg: colibri.ExtensionRegistry): void;
        requestServerMode(): Promise<void>;
        isDesktopMode(): boolean;
        isAdvancedJSEditor(): boolean;
        openFirstWindow(): Promise<void>;
        ideOpenProject(projectName: string): Promise<void>;
        private validateIndexFile;
        isOpeningProject(): boolean;
        setTheme(theme: controls.ITheme): void;
        restoreTheme(): void;
    }
    const VER = "3.0.0-dev";
}
declare namespace phasereditor2d.ide.core {
    import io = colibri.core.io;
    class MultiHashBuilder {
        private _tokens;
        constructor();
        addPartialToken(token: string): void;
        addPartialFileToken(file: io.FilePath): void;
        build(): string;
    }
}
declare namespace phasereditor2d.ide.core {
    class PhaserDocs {
        private _data;
        private _plugin;
        private _filePath;
        constructor(plugin: colibri.Plugin, filePath: string);
        preload(): Promise<void>;
        getDoc(helpKey: any): string;
    }
}
declare namespace phasereditor2d.ide.ui {
    import ide = colibri.ui.ide;
    class DesignWindow extends ide.WorkbenchWindow {
        static ID: string;
        static MENU_MAIN: string;
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
    const CAT_PROJECT = "phasereditor2d.ide.ui.actions.ProjectCategory";
    const CMD_LOCATE_FILE = "phasereditor2d.ide.ui.actions.LocateFile";
    const CMD_OPEN_PROJECTS_DIALOG = "phasereditor2d.ide.ui.actions.OpenProjectsDialog";
    const CMD_RELOAD_PROJECT = "phasereditor2d.ide.ui.actions.ReloadProjectAction";
    const CMD_CHANGE_THEME = "phasereditor2d.ide.ui.actions.SwitchTheme";
    const CMD_PLAY_PROJECT = "phasereditor2d.ide.ui.actions.PlayProject";
    const CMD_QUICK_PLAY_PROJECT = "phasereditor2d.ide.ui.actions.QuickPlayProject";
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
    function OpenProjectHandler(args: colibri.ui.ide.commands.HandlerArgs): void;
}
declare namespace phasereditor2d.ide.ui.actions {
    import commands = colibri.ui.ide.commands;
    function OpenThemeDialogHandler(args: commands.HandlerArgs): void;
    namespace OpenThemeDialogHandler {
        var test: (args: commands.HandlerArgs) => boolean;
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
    import io = colibri.core.io;
    class NewProjectDialogExtension extends files.ui.dialogs.NewDialogExtension {
        constructor();
        createDialog(args: {
            initialFileLocation: io.FilePath;
        }): colibri.ui.controls.dialogs.Dialog;
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
    class PlayDialog extends controls.dialogs.Dialog {
        private _url;
        constructor(url: string);
        protected resize(): void;
        createDialogArea(): void;
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
//# sourceMappingURL=phasereditor2d.ide.d.ts.map