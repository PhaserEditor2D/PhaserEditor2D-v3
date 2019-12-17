namespace phasereditor2d.ide {

    import ide = colibri.ui.ide;
    import controls = colibri.ui.controls;

    export const ICON_PLAY = "play";
    export const ICON_MENU = "menu";
    export const ICON_THEME = "theme";

    export class IDEPlugin extends colibri.Plugin {

        private static _instance = new IDEPlugin();

        private _openingProject: boolean;

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
                    this.getIcon(ICON_MENU),
                    this.getIcon(ICON_THEME)
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

            let win: ui.DesignWindow = null;

            if (defaultProjectData) {

                const projectName = defaultProjectData["projectName"];

                let projects = await wb.getFileStorage().getProjects();

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

                await wb.openProject(projectName, monitor);

                dlg.setProgress(1);

                this.validateIndexFile();

                const designWindow = wb.activateWindow(ui.DesignWindow.ID) as ui.DesignWindow;

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

        setTheme(theme: controls.Theme) {

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
    }

    colibri.Platform.addPlugin(IDEPlugin.getInstance());


    /* program entry point */

    export const VER = "3.0.0";

    async function main() {

        console.log(`%c %c Phaser Editor 2D %c v${VER} %c %c https://phasereditor2d.com `,
            "background-color:red",
            "background-color:#3f3f3f;color:whitesmoke",
            "background-color:orange;color:black",
            "background-color:red",
            "background-color:silver",
        );

        colibri.ui.controls.dialogs.AlertDialog.replaceConsoleAlert();

        await colibri.Platform.start();

        await IDEPlugin.getInstance().openFirstWindow();
    }

    window.addEventListener("load", main);
}