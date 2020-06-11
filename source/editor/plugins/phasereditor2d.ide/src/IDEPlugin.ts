namespace phasereditor2d.ide {

    import controls = colibri.ui.controls;
    import io = colibri.core.io;

    export const ICON_PLAY = "play";

    export class IDEPlugin extends colibri.Plugin {

        private static _instance = new IDEPlugin();

        private _openingProject: boolean;
        private _desktopMode: boolean;
        private _advancedJSEditor: boolean;

        static getInstance() {
            return this._instance;
        }

        private constructor() {
            super("phasereditor2d.ide");

            this._openingProject = false;
        }

        registerExtensions(reg: colibri.ExtensionRegistry) {

            // windows

            reg.addExtension(
                new colibri.ui.ide.WindowExtension(
                    () => new ui.DesignWindow()
                )
            );

            reg.addExtension(
                new colibri.ui.ide.WindowExtension(
                    () => new ui.WelcomeWindow()
                )
            );

            // icons

            reg.addExtension(
                new colibri.ui.ide.IconLoaderExtension([
                    this.getIcon(ICON_PLAY),
                ]));

            // keys

            reg.addExtension(
                new colibri.ui.ide.commands.CommandExtension(
                    ui.actions.IDEActions.registerCommands
                )
            );

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

            // new dialogs

            reg.addExtension(new ui.dialogs.NewProjectDialogExtension());

            // files view menu

            if (IDEPlugin.getInstance().isDesktopMode()) {

                reg.addExtension(new controls.MenuExtension(files.ui.views.FilesView.MENU_ID, {
                    command: ui.actions.CMD_LOCATE_FILE
                }));
            }
        }

        async requestServerMode() {

            const data = await colibri.core.io.apiRequest("GetServerMode");

            this._desktopMode = data.desktop === true;
            this._advancedJSEditor = data.advancedJSEditor === true;
        }

        isDesktopMode() {
            return this._desktopMode;
        }

        isAdvancedJSEditor() {
            return this._advancedJSEditor;
        }

        async openFirstWindow() {

            this.restoreTheme();

            const wb = colibri.Platform.getWorkbench();

            wb.eventProjectOpened.addListener(() => {

                wb.getGlobalPreferences().setValue("defaultProjectData", {
                    projectName: wb.getFileStorage().getRoot().getName()
                });
            });

            const prefs = wb.getGlobalPreferences();

            const defaultProjectData = prefs.getValue("defaultProjectData");

            let win: ui.DesignWindow = null;

            if (defaultProjectData) {

                const projectName = defaultProjectData["projectName"];

                const projects = await wb.getFileStorage().getProjects();

                if (projects.indexOf(projectName) >= 0) {

                    await this.ideOpenProject(projectName);

                    return;
                }
            }

            win = wb.activateWindow(ui.WelcomeWindow.ID) as ui.DesignWindow;

            if (win) {

                win.restoreState(wb.getProjectPreferences());
            }
        }

        async ideOpenProject(projectName: string) {

            this._openingProject = true;

            controls.dialogs.Dialog.closeAllDialogs();

            const dlg = new ui.dialogs.OpeningProjectDialog();
            dlg.create();
            dlg.setTitle("Opening " + projectName);
            dlg.setProgress(0);

            const monitor = new controls.dialogs.ProgressDialogMonitor(dlg);

            try {

                const wb = colibri.Platform.getWorkbench();

                {
                    const win = wb.getActiveWindow();

                    if (win instanceof ui.DesignWindow) {
                        win.saveState(wb.getProjectPreferences());
                    }
                }

                console.log(`IDEPlugin: opening project ${projectName}`);

                const designWindow = wb.activateWindow(ui.DesignWindow.ID) as ui.DesignWindow;

                const editorArea = designWindow.getEditorArea();

                editorArea.closeAllEditors();

                await wb.openProject(projectName, monitor);

                dlg.setProgress(1);

                this.validateIndexFile();

                if (designWindow) {

                    designWindow.restoreState(wb.getProjectPreferences());
                }

            } finally {

                this._openingProject = false;

                dlg.close();
            }
        }

        private validateIndexFile() {

            const root = colibri.Platform.getWorkbench().getFileStorage().getRoot();

            const indexFile = root.getFile("index.html");

            if (!indexFile || indexFile.isFolder()) {

                alert("Missing 'index.html' file at the root folder.");
            }
        }

        isOpeningProject() {
            return this._openingProject;
        }

        setTheme(theme: controls.ITheme) {

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
                    .getExtensions<colibri.ui.ide.themes.ThemeExtension>(colibri.ui.ide.themes.ThemeExtension.POINT_ID)
                    .map(e => e.getTheme())
                    .find(t => t.id === id);
            }

            controls.Controls.setTheme(theme ?? controls.Controls.LIGHT_THEME);
        }

        openProjectInVSCode() {

            this.openFileInVSCode(colibri.ui.ide.FileUtils.getRoot());
        }

        async openFileInVSCode(file: io.FilePath) {

            const resp = await colibri.core.io.apiRequest("OpenVSCode", { location: file.getFullName() });

            if (resp.error) {

                alert(resp.error);
            }
        }
    }

    colibri.Platform.addPlugin(IDEPlugin.getInstance());

    /* program entry point */

    export const VER = "3.1.1-next" + Date.now();

    async function main() {

        colibri.CACHE_VERSION = VER;

        console.log(`%c %c Phaser Editor 2D %c v${VER} %c %c https://phasereditor2d.com `,
            "background-color:red",
            "background-color:#3f3f3f;color:whitesmoke",
            "background-color:orange;color:black",
            "background-color:red",
            "background-color:silver",
        );

        colibri.ui.controls.dialogs.AlertDialog.replaceConsoleAlert();

        await IDEPlugin.getInstance().requestServerMode();

        await colibri.Platform.start();

        await IDEPlugin.getInstance().openFirstWindow();
    }

    window.addEventListener("load", main);
}