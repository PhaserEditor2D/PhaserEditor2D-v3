var phasereditor2d;
(function (phasereditor2d) {
    var ide;
    (function (ide_1) {
        var controls = colibri.ui.controls;
        ide_1.ICON_PLAY = "play";
        ide_1.ICON_MENU = "menu";
        ide_1.ICON_THEME = "theme";
        class IDEPlugin extends colibri.Plugin {
            constructor() {
                super("phasereditor2d.ide");
                this._openingProject = false;
            }
            static getInstance() {
                return this._instance;
            }
            registerExtensions(reg) {
                // windows
                reg.addExtension(new colibri.ui.ide.WindowExtension(() => new ide_1.ui.DesignWindow()));
                reg.addExtension(new colibri.ui.ide.WindowExtension(() => new ide_1.ui.WelcomeWindow()));
                // icons
                reg.addExtension(new colibri.ui.ide.IconLoaderExtension([
                    this.getIcon(ide_1.ICON_PLAY),
                    this.getIcon(ide_1.ICON_MENU),
                    this.getIcon(ide_1.ICON_THEME)
                ]));
                // keys
                reg.addExtension(new colibri.ui.ide.commands.CommandExtension(ide_1.ui.actions.IDEActions.registerCommands));
                // themes 
                reg.addExtension(new colibri.ui.ide.themes.ThemeExtension({
                    dark: false,
                    id: "lightBlue",
                    classList: ["lightBlue"],
                    displayName: "Light Blue",
                    viewerForeground: controls.Controls.LIGHT_THEME.viewerForeground,
                    viewerSelectionForeground: controls.Controls.LIGHT_THEME.viewerSelectionForeground,
                    viewerSelectionBackground: controls.Controls.LIGHT_THEME.viewerSelectionBackground,
                }));
                reg.addExtension(new colibri.ui.ide.themes.ThemeExtension({
                    dark: false,
                    id: "lightGray",
                    classList: ["light", "lightGray"],
                    displayName: "Light Gray",
                    viewerForeground: controls.Controls.LIGHT_THEME.viewerForeground,
                    viewerSelectionForeground: controls.Controls.LIGHT_THEME.viewerSelectionForeground,
                    viewerSelectionBackground: controls.Controls.LIGHT_THEME.viewerSelectionBackground,
                }));
                reg.addExtension(new colibri.ui.ide.themes.ThemeExtension({
                    dark: true,
                    id: "darkPlus",
                    classList: ["darkPlus"],
                    displayName: "Dark Plus",
                    viewerForeground: controls.Controls.DARK_THEME.viewerForeground,
                    viewerSelectionForeground: controls.Controls.DARK_THEME.viewerSelectionForeground,
                    viewerSelectionBackground: controls.Controls.DARK_THEME.viewerSelectionBackground,
                }));
            }
            async openFirstWindow() {
                this.restoreTheme();
                const wb = colibri.Platform.getWorkbench();
                wb.addEventListener(colibri.ui.ide.EVENT_PROJECT_OPENED, e => {
                    wb.getGlobalPreferences().setValue("defaultProjectData", {
                        "projectName": wb.getFileStorage().getRoot().getName()
                    });
                });
                const prefs = wb.getGlobalPreferences();
                const defaultProjectData = prefs.getValue("defaultProjectData");
                let win = null;
                if (defaultProjectData) {
                    const projectName = defaultProjectData["projectName"];
                    let projects = await wb.getFileStorage().getProjects();
                    if (projects.indexOf(projectName) >= 0) {
                        await this.ideOpenProject(projectName);
                        return;
                    }
                }
                win = wb.activateWindow(ide_1.ui.WelcomeWindow.ID);
                if (win) {
                    win.restoreState(wb.getProjectPreferences());
                }
            }
            async ideOpenProject(projectName) {
                this._openingProject = true;
                const dlg = new ide_1.ui.dialogs.OpeningProjectDialog();
                dlg.create();
                dlg.setTitle("Opening " + projectName);
                dlg.setProgress(0);
                const monitor = new controls.dialogs.ProgressDialogMonitor(dlg);
                try {
                    const wb = colibri.Platform.getWorkbench();
                    {
                        const win = wb.getActiveWindow();
                        if (win instanceof ide_1.ui.DesignWindow) {
                            win.saveState(wb.getProjectPreferences());
                        }
                    }
                    console.log(`IDEPlugin: opening project ${projectName}`);
                    await wb.openProject(projectName, monitor);
                    dlg.setProgress(1);
                    this.validateIndexFile();
                    const designWindow = wb.activateWindow(ide_1.ui.DesignWindow.ID);
                    if (designWindow) {
                        designWindow.restoreState(wb.getProjectPreferences());
                    }
                }
                finally {
                    this._openingProject = false;
                    dlg.close();
                }
            }
            validateIndexFile() {
                const root = colibri.Platform.getWorkbench().getFileStorage().getRoot();
                const indexFile = root.getFile("index.html");
                if (!indexFile || indexFile.isFolder()) {
                    alert("Missing 'index.html' file at the root folder.");
                }
            }
            isOpeningProject() {
                return this._openingProject;
            }
            setTheme(theme) {
                controls.Controls.setTheme(theme);
                const prefs = colibri.Platform.getWorkbench().getGlobalPreferences();
                prefs.setValue("phasereditor2d.ide.theme", {
                    theme: theme.id
                });
            }
            restoreTheme() {
                const prefs = colibri.Platform.getWorkbench().getGlobalPreferences();
                const themeData = prefs.getValue("phasereditor2d.ide.theme");
                let theme = null;
                if (themeData) {
                    const id = themeData.theme;
                    theme = colibri.Platform
                        .getExtensions(colibri.ui.ide.themes.ThemeExtension.POINT_ID)
                        .map(e => e.getTheme())
                        .find(t => t.id === id);
                }
                controls.Controls.setTheme((theme !== null && theme !== void 0 ? theme : controls.Controls.LIGHT_THEME));
            }
        }
        IDEPlugin._instance = new IDEPlugin();
        ide_1.IDEPlugin = IDEPlugin;
        colibri.Platform.addPlugin(IDEPlugin.getInstance());
        /* program entry point */
        ide_1.VER = "3.0.0";
        async function main() {
            console.log(`%c %c Phaser Editor 2D %c v${ide_1.VER} %c %c https://phasereditor2d.com `, "background-color:red", "background-color:#3f3f3f;color:whitesmoke", "background-color:orange;color:black", "background-color:red", "background-color:silver");
            colibri.ui.controls.dialogs.AlertDialog.replaceConsoleAlert();
            await colibri.Platform.start();
            await IDEPlugin.getInstance().openFirstWindow();
        }
        window.addEventListener("load", main);
    })(ide = phasereditor2d.ide || (phasereditor2d.ide = {}));
})(phasereditor2d || (phasereditor2d = {}));
var phasereditor2d;
(function (phasereditor2d) {
    var ide;
    (function (ide_2) {
        var ui;
        (function (ui) {
            var controls = colibri.ui.controls;
            var ide = colibri.ui.ide;
            class DesignWindow extends ide.WorkbenchWindow {
                constructor() {
                    super(DesignWindow.ID);
                    ide.Workbench.getWorkbench().addEventListener(ide.EVENT_PART_ACTIVATED, e => {
                        this.saveWindowState();
                    });
                    window.addEventListener("beforeunload", e => {
                        this.saveWindowState();
                    });
                }
                saveWindowState() {
                    if (ide_2.IDEPlugin.getInstance().isOpeningProject()) {
                        return;
                    }
                    const wb = ide.Workbench.getWorkbench();
                    const win = wb.getActiveWindow();
                    if (win instanceof DesignWindow) {
                        win.saveState(wb.getProjectPreferences());
                    }
                }
                saveState(prefs) {
                    this.saveEditorsState(prefs);
                }
                restoreState(prefs) {
                    this.restoreEditors(prefs);
                }
                createParts() {
                    this._outlineView = new phasereditor2d.outline.ui.views.OutlineView();
                    this._filesView = new phasereditor2d.files.ui.views.FilesView();
                    this._inspectorView = new phasereditor2d.inspector.ui.views.InspectorView();
                    this._blocksView = new phasereditor2d.blocks.ui.views.BlocksView();
                    this._editorArea = new ide.EditorArea();
                    this._split_Files_Blocks = new controls.SplitPanel(this.createViewFolder(this._filesView), this.createViewFolder(this._blocksView));
                    this._split_Editor_FilesBlocks = new controls.SplitPanel(this._editorArea, this._split_Files_Blocks, false);
                    this._split_Outline_EditorFilesBlocks = new controls.SplitPanel(this.createViewFolder(this._outlineView), this._split_Editor_FilesBlocks);
                    this._split_OutlineEditorFilesBlocks_Inspector = new controls.SplitPanel(this._split_Outline_EditorFilesBlocks, this.createViewFolder(this._inspectorView));
                    this.getClientArea().add(this._split_OutlineEditorFilesBlocks_Inspector);
                    this.initToolbar();
                    this.initialLayout();
                }
                initToolbar() {
                    const toolbar = this.getToolbar();
                    {
                        // left area 
                        const area = toolbar.getLeftArea();
                        const manager = new controls.ToolbarManager(area);
                        manager.add(new phasereditor2d.files.ui.actions.OpenNewFileDialogAction());
                        manager.add(new ui.actions.OpenProjectsDialogAction());
                        manager.add(new phasereditor2d.ide.ui.actions.PlayProjectAction());
                    }
                    {
                        // right area 
                        const area = toolbar.getRightArea();
                        const manager = new controls.ToolbarManager(area);
                        manager.add(new ui.actions.OpenMainMenuAction());
                    }
                }
                getEditorArea() {
                    return this._editorArea;
                }
                initialLayout() {
                    //const b = { x: 0, y: 0, width: window.innerWidth, height: window.innerHeight };
                    this._split_Files_Blocks.setSplitFactor(0.2);
                    this._split_Editor_FilesBlocks.setSplitFactor(0.6);
                    this._split_Outline_EditorFilesBlocks.setSplitFactor(0.15);
                    this._split_OutlineEditorFilesBlocks_Inspector.setSplitFactor(0.8);
                    //this.setBounds(b);
                    this.layout();
                }
            }
            DesignWindow.ID = "phasereditor2d.ide.ui.DesignWindow";
            ui.DesignWindow = DesignWindow;
        })(ui = ide_2.ui || (ide_2.ui = {}));
    })(ide = phasereditor2d.ide || (phasereditor2d.ide = {}));
})(phasereditor2d || (phasereditor2d = {}));
var phasereditor2d;
(function (phasereditor2d) {
    var ide;
    (function (ide) {
        var ui;
        (function (ui) {
            class WelcomeWindow extends colibri.ui.ide.WorkbenchWindow {
                constructor() {
                    super(WelcomeWindow.ID);
                }
                getEditorArea() {
                    return new colibri.ui.ide.EditorArea();
                }
                async createParts() {
                    const projects = await colibri.ui.ide.FileUtils.getProjects_async();
                    if (projects.length === 0) {
                        const dlg = new ui.dialogs.NewProjectDialog();
                        dlg.setCancellable(false);
                        dlg.setCloseWithEscapeKey(false);
                        dlg.create();
                    }
                    else {
                        const dlg = new ui.dialogs.ProjectsDialog();
                        dlg.setCloseWithEscapeKey(false);
                        dlg.create();
                    }
                }
            }
            WelcomeWindow.ID = "phasereditor2d.welcome.ui.WelcomeWindow";
            ui.WelcomeWindow = WelcomeWindow;
        })(ui = ide.ui || (ide.ui = {}));
    })(ide = phasereditor2d.ide || (phasereditor2d.ide = {}));
})(phasereditor2d || (phasereditor2d = {}));
var phasereditor2d;
(function (phasereditor2d) {
    var ide;
    (function (ide) {
        var ui;
        (function (ui) {
            var actions;
            (function (actions) {
                actions.CMD_OPEN_PROJECTS_DIALOG = "phasereditor2d.ide.ui.actions.OpenProjectsDialog";
                actions.CMD_RELOAD_PROJECT = "phasereditor2d.ide.ui.actions.ReloadProjectAction";
                actions.CMD_SWITCH_THEME = "phasereditor2d.ide.ui.actions.SwitchTheme";
                actions.CMD_EDITOR_TABS_SIZE_UP = "phasereditor2d.ide.ui.actions.EditorTabsSizeUp";
                actions.CMD_EDITOR_TABS_SIZE_DOWN = "phasereditor2d.ide.ui.actions.EditorTabsSizeDown";
                var commands = colibri.ui.ide.commands;
                function isNotWelcomeWindowScope(args) {
                    return !(args.activeWindow instanceof ui.WelcomeWindow);
                }
                class IDEActions {
                    static registerCommands(manager) {
                        // open project
                        manager.addCommandHelper(actions.CMD_OPEN_PROJECTS_DIALOG);
                        manager.addHandlerHelper(actions.CMD_OPEN_PROJECTS_DIALOG, args => isNotWelcomeWindowScope(args) && !args.activeDialog, args => new actions.OpenProjectsDialogAction().run());
                        manager.addKeyBinding(actions.CMD_OPEN_PROJECTS_DIALOG, new commands.KeyMatcher({
                            control: true,
                            alt: true,
                            key: "P",
                            filterInputElements: false
                        }));
                        // reload project
                        manager.addCommandHelper(actions.CMD_RELOAD_PROJECT);
                        manager.addHandlerHelper(actions.CMD_RELOAD_PROJECT, isNotWelcomeWindowScope, args => new actions.ReloadProjectAction().run());
                        manager.addKeyBinding(actions.CMD_RELOAD_PROJECT, new commands.KeyMatcher({
                            control: true,
                            alt: true,
                            key: "R"
                        }));
                        // theme dialog
                        manager.addCommandHelper(actions.CMD_SWITCH_THEME);
                        manager.addHandlerHelper(actions.CMD_SWITCH_THEME, actions.OpenThemeDialogAction.commandTest, args => new actions.OpenThemeDialogAction().run());
                        manager.addKeyBinding(actions.CMD_SWITCH_THEME, new commands.KeyMatcher({
                            control: true,
                            key: "2",
                            filterInputElements: false
                        }));
                        // editor tabs size
                        manager.addCommandHelper(actions.CMD_EDITOR_TABS_SIZE_DOWN);
                        manager.addCommandHelper(actions.CMD_EDITOR_TABS_SIZE_UP);
                        manager.addHandlerHelper(actions.CMD_EDITOR_TABS_SIZE_DOWN, isNotWelcomeWindowScope, args => colibri.Platform.getWorkbench().getActiveWindow().getEditorArea().incrementTabIconSize(-5));
                        manager.addHandlerHelper(actions.CMD_EDITOR_TABS_SIZE_UP, isNotWelcomeWindowScope, args => colibri.Platform.getWorkbench().getActiveWindow().getEditorArea().incrementTabIconSize(5));
                        manager.addKeyBinding(actions.CMD_EDITOR_TABS_SIZE_DOWN, new commands.KeyMatcher({
                            control: true,
                            key: "3"
                        }));
                        manager.addKeyBinding(actions.CMD_EDITOR_TABS_SIZE_UP, new commands.KeyMatcher({
                            control: true,
                            key: "4"
                        }));
                    }
                }
                actions.IDEActions = IDEActions;
            })(actions = ui.actions || (ui.actions = {}));
        })(ui = ide.ui || (ide.ui = {}));
    })(ide = phasereditor2d.ide || (phasereditor2d.ide = {}));
})(phasereditor2d || (phasereditor2d = {}));
var phasereditor2d;
(function (phasereditor2d) {
    var ide;
    (function (ide) {
        var ui;
        (function (ui) {
            var actions;
            (function (actions) {
                var controls = colibri.ui.controls;
                class OpenMainMenuAction extends controls.Action {
                    constructor() {
                        super({
                            //text: "Menu",
                            icon: ide.IDEPlugin.getInstance().getIcon(ide.ICON_MENU)
                        });
                    }
                    run(e) {
                        const menu = new controls.Menu();
                        menu.add(new controls.Action({
                            text: "Help",
                            callback: () => controls.Controls.openUrlInNewPage("https://phasereditor2d.com/docs/v3")
                        }));
                        menu.addSeparator();
                        menu.add(new actions.ReloadProjectAction());
                        menu.add(new actions.OpenThemeDialogAction());
                        menu.addSeparator();
                        menu.add(new controls.Action({
                            text: "Unlock Phaser Editor 2D"
                        }));
                        menu.add(new controls.Action({
                            text: "About",
                            callback: () => {
                                new ui.dialogs.AboutDialog().create();
                            }
                        }));
                        menu.create(e);
                    }
                }
                actions.OpenMainMenuAction = OpenMainMenuAction;
            })(actions = ui.actions || (ui.actions = {}));
        })(ui = ide.ui || (ide.ui = {}));
    })(ide = phasereditor2d.ide || (phasereditor2d.ide = {}));
})(phasereditor2d || (phasereditor2d = {}));
var phasereditor2d;
(function (phasereditor2d) {
    var ide;
    (function (ide) {
        var ui;
        (function (ui) {
            var actions;
            (function (actions) {
                var controls = colibri.ui.controls;
                class OpenProjectsDialogAction extends controls.Action {
                    constructor() {
                        super({
                            // text: "Open Project",
                            icon: colibri.Platform.getWorkbench().getWorkbenchIcon(colibri.ui.ide.ICON_FOLDER)
                        });
                    }
                    run() {
                        const dlg = new ui.dialogs.ProjectsDialog();
                        dlg.create();
                        dlg.addButton("Cancel", () => dlg.close());
                    }
                }
                actions.OpenProjectsDialogAction = OpenProjectsDialogAction;
            })(actions = ui.actions || (ui.actions = {}));
        })(ui = ide.ui || (ide.ui = {}));
    })(ide = phasereditor2d.ide || (phasereditor2d.ide = {}));
})(phasereditor2d || (phasereditor2d = {}));
var phasereditor2d;
(function (phasereditor2d) {
    var ide;
    (function (ide) {
        var ui;
        (function (ui) {
            var actions;
            (function (actions) {
                var controls = colibri.ui.controls;
                class OpenThemeDialogAction extends controls.Action {
                    constructor() {
                        super({
                            text: "Color Theme"
                        });
                    }
                    run() {
                        const dlg = new ui.dialogs.ThemesDialog();
                        dlg.create();
                        dlg.getViewer().setSelection([controls.Controls.getTheme()]);
                        dlg.getViewer().addEventListener(controls.EVENT_SELECTION_CHANGED, e => {
                            const theme = dlg.getViewer().getSelectionFirstElement();
                            if (theme) {
                                ide.IDEPlugin.getInstance().setTheme(theme);
                            }
                        });
                    }
                    static commandTest(args) {
                        return !(args.activeDialog instanceof ui.dialogs.ThemesDialog);
                    }
                }
                actions.OpenThemeDialogAction = OpenThemeDialogAction;
            })(actions = ui.actions || (ui.actions = {}));
        })(ui = ide.ui || (ide.ui = {}));
    })(ide = phasereditor2d.ide || (phasereditor2d.ide = {}));
})(phasereditor2d || (phasereditor2d = {}));
var phasereditor2d;
(function (phasereditor2d) {
    var ide;
    (function (ide) {
        var ui;
        (function (ui) {
            var actions;
            (function (actions) {
                var controls = colibri.ui.controls;
                class PlayProjectAction extends controls.Action {
                    constructor() {
                        super({
                            // text: "Play Project",
                            icon: ide.IDEPlugin.getInstance().getIcon(ide.ICON_PLAY)
                        });
                    }
                    run() {
                        const url = colibri.ui.ide.FileUtils.getRoot().getUrl();
                        controls.Controls.openUrlInNewPage(url);
                    }
                }
                actions.PlayProjectAction = PlayProjectAction;
            })(actions = ui.actions || (ui.actions = {}));
        })(ui = ide.ui || (ide.ui = {}));
    })(ide = phasereditor2d.ide || (phasereditor2d.ide = {}));
})(phasereditor2d || (phasereditor2d = {}));
var phasereditor2d;
(function (phasereditor2d) {
    var ide;
    (function (ide) {
        var ui;
        (function (ui) {
            var actions;
            (function (actions) {
                var controls = colibri.ui.controls;
                class ReloadProjectAction extends controls.Action {
                    constructor() {
                        super({
                            text: "Reload Project"
                        });
                    }
                    run() {
                        ide.IDEPlugin.getInstance().ideOpenProject(colibri.Platform.getWorkbench().getProjectRoot().getName());
                    }
                }
                actions.ReloadProjectAction = ReloadProjectAction;
            })(actions = ui.actions || (ui.actions = {}));
        })(ui = ide.ui || (ide.ui = {}));
    })(ide = phasereditor2d.ide || (phasereditor2d.ide = {}));
})(phasereditor2d || (phasereditor2d = {}));
var phasereditor2d;
(function (phasereditor2d) {
    var ide;
    (function (ide) {
        var ui;
        (function (ui) {
            var dialogs;
            (function (dialogs) {
                var controls = colibri.ui.controls;
                class AboutDialog extends controls.dialogs.Dialog {
                    constructor() {
                        super("AboutDialog");
                    }
                    createDialogArea() {
                        const element = document.createElement("div");
                        element.classList.add("DialogClientArea", "DialogSection");
                        let html = `
            
            <p class="Title"><b>Phaser Editor 2D</b><br><small>v${ide.VER}</small></p>

            <p><i>A friendly IDE for HTML5 game development</i></p>

            <p>
                <a href="https://phasereditor2d.com" target="_blank">phasereditor2d.com</a> <br>
                <a href="https://www.twitter.com/PhaserEditor2D" target="_blank">twitter/PhaserEditor2D</a> <br>
                <a href="https://www.facebook.com/PhaserEditor2D" target="_blank">facebook/PhaserEditor2D</a> <br>
                <a href="https://github.com/PhaserEditor2D/PhaserEditor" target="_blank">github/PhaserEditor2D</a> <br>
            </p>

            <p>
            
            </p>

            <p><small>Copyright &copy; 2016-2020 Arian Fornaris </small></p>
            `;
                        element.innerHTML = html;
                        this.getElement().appendChild(element);
                    }
                    create() {
                        super.create();
                        this.setTitle("About");
                        this.addButton("Close", () => this.close());
                    }
                }
                dialogs.AboutDialog = AboutDialog;
            })(dialogs = ui.dialogs || (ui.dialogs = {}));
        })(ui = ide.ui || (ide.ui = {}));
    })(ide = phasereditor2d.ide || (phasereditor2d.ide = {}));
})(phasereditor2d || (phasereditor2d = {}));
var phasereditor2d;
(function (phasereditor2d) {
    var ide;
    (function (ide) {
        var ui;
        (function (ui) {
            var dialogs;
            (function (dialogs) {
                var controls = colibri.ui.controls;
                var viewers = colibri.ui.controls.viewers;
                class NewProjectDialog extends controls.dialogs.Dialog {
                    constructor() {
                        super("NewProjectDialog");
                        this._projectNames = new Set();
                        this._cancellable = true;
                    }
                    setCancellable(cancellable) {
                        this._cancellable = cancellable;
                    }
                    createDialogArea() {
                        const clientArea = document.createElement("div");
                        clientArea.classList.add("DialogClientArea");
                        clientArea.style.display = "grid";
                        clientArea.style.gridTemplateRows = "1fr auto";
                        clientArea.style.gridTemplateRows = "1fr";
                        clientArea.style.gridRowGap = "5px";
                        clientArea.appendChild(this.createCenterArea());
                        clientArea.appendChild(this.createBottomArea());
                        this.getElement().appendChild(clientArea);
                    }
                    createBottomArea() {
                        const bottomArea = document.createElement("div");
                        bottomArea.classList.add("DialogSection");
                        bottomArea.style.display = "grid";
                        bottomArea.style.gridTemplateColumns = "auto 1fr";
                        bottomArea.style.gridTemplateRows = "auto";
                        bottomArea.style.columnGap = "10px";
                        bottomArea.style.rowGap = "10px";
                        bottomArea.style.alignItems = "center";
                        {
                            const label = document.createElement("label");
                            label.innerText = "Project Name";
                            bottomArea.appendChild(label);
                            const text = document.createElement("input");
                            text.type = "text";
                            text.addEventListener("keyup", e => this.validate());
                            setTimeout(() => text.focus(), 10);
                            bottomArea.appendChild(text);
                            this._projectNameText = text;
                            this.setInitialProjectName();
                        }
                        return bottomArea;
                    }
                    setInitialProjectName() {
                        let name = "Game";
                        let i = 1;
                        while (this._projectNames.has(name.toLowerCase())) {
                            name = "Game" + i;
                            i += 1;
                        }
                        this._projectNameText.value = name;
                    }
                    validate() {
                        let disabled = false;
                        const viewer = this._filteredViewer.getViewer();
                        if (viewer.getSelection().length !== 1) {
                            disabled = true;
                        }
                        if (!disabled) {
                            const obj = viewer.getSelectionFirstElement();
                            if (obj.path === undefined) {
                                disabled = true;
                            }
                        }
                        if (!disabled) {
                            const name = this._projectNameText.value;
                            if (name.trim() === ""
                                || name.startsWith(".")
                                || name.indexOf("/") >= 0
                                || name.indexOf("\\") >= 0) {
                                disabled = true;
                            }
                        }
                        if (!disabled) {
                            if (this._projectNames.has(this._projectNameText.value.toLowerCase())) {
                                disabled = true;
                            }
                        }
                        this._createBtn.disabled = disabled;
                    }
                    async requestProjectsData() {
                        const list = (await colibri.ui.ide.FileUtils.getProjects_async()).map(s => s.toLowerCase());
                        this._projectNames = new Set(list);
                    }
                    create() {
                        this.requestProjectsData().then(() => {
                            super.create();
                            this.setTitle("New Project");
                            this._createBtn = this.addButton("Create Project", () => {
                                const template = this._filteredViewer.getViewer().getSelectionFirstElement();
                                this.closeAll();
                                this.createProject(template.path);
                            });
                            if (this._cancellable) {
                                this.addButton("Cancel", () => this.close());
                            }
                        });
                    }
                    async createProject(templatePath) {
                        const projectName = this._projectNameText.value;
                        const ok = await colibri.ui.ide.FileUtils.createProject_async(templatePath, projectName);
                        if (ok) {
                            this.closeAll();
                            ide.IDEPlugin.getInstance().ideOpenProject(projectName);
                        }
                    }
                    createCenterArea() {
                        const centerArea = document.createElement("div");
                        this.createFilteredViewer();
                        centerArea.appendChild(this._filteredViewer.getElement());
                        return centerArea;
                    }
                    createFilteredViewer() {
                        const viewer = new controls.viewers.TreeViewer();
                        viewer.setLabelProvider(new TemplatesLabelProvider());
                        viewer.setCellRendererProvider(new TemplatesCellRendererProvider());
                        viewer.setContentProvider(new TemplatesContentProvider());
                        viewer.setInput({
                            providers: []
                        });
                        colibri.ui.ide.FileUtils.getProjectTemplates_async().then(data => {
                            viewer.setInput(data);
                            for (const provider of data.providers) {
                                viewer.setExpanded(provider, true);
                            }
                            viewer.setSelection([data.providers[0].templates[0]]);
                            viewer.repaint();
                        });
                        viewer.addEventListener(controls.EVENT_SELECTION_CHANGED, e => {
                            this.validate();
                        });
                        this._filteredViewer = new viewers.FilteredViewerInElement(viewer);
                    }
                    layout() {
                        super.layout();
                        this._filteredViewer.resizeTo();
                    }
                }
                dialogs.NewProjectDialog = NewProjectDialog;
                class TemplatesContentProvider {
                    getRoots(input) {
                        const data = input;
                        return data.providers;
                    }
                    getChildren(parent) {
                        if (parent.templates) {
                            return parent.templates;
                        }
                        return [];
                    }
                }
                class TemplatesLabelProvider {
                    getLabel(obj) {
                        return obj.name;
                    }
                }
                class TemplatesCellRendererProvider {
                    getCellRenderer(element) {
                        return new controls.viewers.IconImageCellRenderer(colibri.Platform.getWorkbench().getWorkbenchIcon(colibri.ui.ide.ICON_FOLDER));
                    }
                    preload(element) {
                        return controls.Controls.resolveNothingLoaded();
                    }
                }
            })(dialogs = ui.dialogs || (ui.dialogs = {}));
        })(ui = ide.ui || (ide.ui = {}));
    })(ide = phasereditor2d.ide || (phasereditor2d.ide = {}));
})(phasereditor2d || (phasereditor2d = {}));
var phasereditor2d;
(function (phasereditor2d) {
    var ide;
    (function (ide) {
        var ui;
        (function (ui) {
            var dialogs;
            (function (dialogs) {
                var controls = colibri.ui.controls;
                class OpeningProjectDialog extends controls.dialogs.ProgressDialog {
                    create() {
                        super.create();
                        this.getDialogBackgroundElement().classList.add("DarkDialogContainer");
                    }
                }
                dialogs.OpeningProjectDialog = OpeningProjectDialog;
            })(dialogs = ui.dialogs || (ui.dialogs = {}));
        })(ui = ide.ui || (ide.ui = {}));
    })(ide = phasereditor2d.ide || (phasereditor2d.ide = {}));
})(phasereditor2d || (phasereditor2d = {}));
var phasereditor2d;
(function (phasereditor2d) {
    var ide;
    (function (ide) {
        var ui;
        (function (ui) {
            var dialogs;
            (function (dialogs) {
                var controls = colibri.ui.controls;
                class ProjectsDialog extends controls.dialogs.ViewerDialog {
                    constructor() {
                        super(new controls.viewers.TreeViewer());
                    }
                    async create() {
                        super.create();
                        const viewer = this.getViewer();
                        viewer.setLabelProvider(new controls.viewers.LabelProvider());
                        viewer.setCellRendererProvider(new ui.viewers.ProjectCellRendererProvider());
                        viewer.setContentProvider(new controls.viewers.ArrayTreeContentProvider());
                        viewer.setInput([]);
                        viewer.addEventListener(controls.viewers.EVENT_OPEN_ITEM, e => this.openProject());
                        const activeWindow = colibri.Platform.getWorkbench().getActiveWindow();
                        this.setTitle("Projects");
                        this.addButton("New Project", () => this.openNewProjectDialog());
                        const root = colibri.ui.ide.FileUtils.getRoot();
                        {
                            const btn = this.addButton("Open Project", () => this.openProject());
                            btn.disabled = true;
                            viewer.addEventListener(controls.EVENT_SELECTION_CHANGED, e => {
                                let disabled = false;
                                const sel = viewer.getSelection();
                                try {
                                    if (root) {
                                        if (sel[0] === root.getName()) {
                                            disabled = true;
                                            return;
                                        }
                                    }
                                    if (sel.length !== 1) {
                                        disabled = true;
                                        return;
                                    }
                                }
                                finally {
                                    btn.disabled = disabled;
                                }
                            });
                        }
                        let projects = await colibri.ui.ide.FileUtils.getProjects_async();
                        // if (root) {
                        //     projects = projects.filter(project => root.getName() !== project);
                        // }
                        viewer.setInput(projects);
                        if (root) {
                            viewer.setSelection([root.getName()]);
                        }
                        viewer.repaint();
                    }
                    async openProject() {
                        this.close();
                        const project = this.getViewer().getSelectionFirstElement();
                        ide.IDEPlugin.getInstance().ideOpenProject(project);
                    }
                    openNewProjectDialog() {
                        const dlg = new dialogs.NewProjectDialog();
                        dlg.create();
                    }
                }
                dialogs.ProjectsDialog = ProjectsDialog;
            })(dialogs = ui.dialogs || (ui.dialogs = {}));
        })(ui = ide.ui || (ide.ui = {}));
    })(ide = phasereditor2d.ide || (phasereditor2d.ide = {}));
})(phasereditor2d || (phasereditor2d = {}));
var phasereditor2d;
(function (phasereditor2d) {
    var ide;
    (function (ide) {
        var ui;
        (function (ui) {
            var dialogs;
            (function (dialogs) {
                var controls = colibri.ui.controls;
                class ThemesDialog extends controls.dialogs.ViewerDialog {
                    constructor() {
                        super(new ThemeViewer());
                        this.setSize(200, 300);
                    }
                    create() {
                        super.create();
                        this.setTitle("Themes");
                        this.addButton("Close", () => this.close());
                    }
                }
                dialogs.ThemesDialog = ThemesDialog;
                class ThemeViewer extends controls.viewers.TreeViewer {
                    constructor() {
                        super("ThemeViewer");
                        this.setLabelProvider(new ThemeLabelProvider());
                        this.setContentProvider(new controls.viewers.ArrayTreeContentProvider());
                        this.setCellRendererProvider(new controls.viewers.EmptyCellRendererProvider(e => new controls.viewers.IconImageCellRenderer(ide.IDEPlugin.getInstance().getIcon(ide.ICON_THEME))));
                        this.setInput(colibri.Platform
                            .getExtensions(colibri.ui.ide.themes.ThemeExtension.POINT_ID)
                            .map(ext => ext.getTheme())
                            .sort((a, b) => a.displayName.localeCompare(b.displayName)));
                    }
                }
                class ThemeLabelProvider extends controls.viewers.LabelProvider {
                    getLabel(theme) {
                        return theme.displayName;
                    }
                }
            })(dialogs = ui.dialogs || (ui.dialogs = {}));
        })(ui = ide.ui || (ide.ui = {}));
    })(ide = phasereditor2d.ide || (phasereditor2d.ide = {}));
})(phasereditor2d || (phasereditor2d = {}));
var phasereditor2d;
(function (phasereditor2d) {
    var ide;
    (function (ide) {
        var ui;
        (function (ui) {
            var viewers;
            (function (viewers) {
                var controls = colibri.ui.controls;
                class ProjectCellRendererProvider {
                    getCellRenderer(element) {
                        return new controls.viewers.IconImageCellRenderer(colibri.Platform.getWorkbench().getWorkbenchIcon(colibri.ui.ide.ICON_FOLDER));
                    }
                    preload(element) {
                        return controls.Controls.resolveNothingLoaded();
                    }
                }
                viewers.ProjectCellRendererProvider = ProjectCellRendererProvider;
            })(viewers = ui.viewers || (ui.viewers = {}));
        })(ui = ide.ui || (ide.ui = {}));
    })(ide = phasereditor2d.ide || (phasereditor2d.ide = {}));
})(phasereditor2d || (phasereditor2d = {}));
